import { useOnDraw } from "./canvasHooks";

const lineColor = '#00FFFF';

const Canvas = ({width, height, delPath, setDelPath, updateDrawingPoints}) => {

    const setCanvasRef = useOnDraw(onDraw, delPath, setDelPath, deletePath, borderPoints, updateDrawingPoints);

    function onDraw(ctx, point, prevPoint){
        
        drawLine(prevPoint, point, ctx, lineColor, 5);
    
    }

    function drawLine(
        start,
        end,
        ctx,
        color,
        width
    ) {
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
        ctx.fill();

    }

    // delete path on canvas
    function deletePath(ctx) {
        ctx.clearRect(0, 0, width, height);
    }

    // draw points on border line when drawing goes outside
    function borderPoints(point){
        
        const radius = width / 2;
        // console.log('radius: ', radius);

        // center coordinates of circle
        const h = radius;
        const k = radius;
        

        const distance = Math.sqrt( (point.x - h)**2 + (point.y - k)**2 ); 

        if(distance > radius) {
            point.x = h + (point.x - h) * radius / distance;
            point.y = k + (point.y - k) * radius / distance;
        }

    }
    
    return (
        <canvas 
        width={width}
        height={height}
        style={canvasStyle}
        ref = {setCanvasRef}
        />
        
    );
}

export default Canvas;

const canvasStyle = {
    border : "1px solid black",
    borderRadius : "50%",
    position : "fixed"
    
}