import { useEffect, useRef } from 'react';

export function useOnDraw(onDraw, delPath, setDelPath, deletePath, borderPoints, updateDrawingPoints) {

    const canvasRef = useRef(null);

    const isDrawingRef = useRef(false);

    const mouseMoveListenerRef = useRef(null);
    const mouseDownListenerRef = useRef(null);
    const mouseUpListenerRef= useRef(null);
    const previousPointRef = useRef(null);

    useEffect(() => {
        return () => {
            if(mouseMoveListenerRef.current){
                window.removeEventListener("mousemove", mouseMoveListenerRef.current);
            }
            if(mouseUpListenerRef.current){
                window.removeEventListener("mouseup", mouseUpListenerRef.current);
            }
        }
    }, []);

    function setCanvasRef(ref) {

        if(!ref) return;
        // canvasRef.current.removeEventListener("mousedown", mouseDownListenerRef.current);
        canvasRef.current = ref;
        initMouseMoveListener();
        initMouseDownListener();
        initMouseUpListener(); 
        initDeletePath();

        
    }

    function initMouseMoveListener() {
        
        const mouseMouseListener = (e) =>{
            if(isDrawingRef.current){
                const point = computePointInCanvas(e.clientX, e.clientY);
                const ctx = canvasRef.current.getContext('2d');
                
                // hanling points outside of box
                if(borderPoints) borderPoints(point) 
                updateDrawingPoints(point);

                if(onDraw) onDraw(ctx, point, previousPointRef.current);
                
                previousPointRef.current = point;
                
            }
        }
        mouseMoveListenerRef.current = mouseMouseListener;
        window.addEventListener("mousemove", mouseMouseListener);
    }

    function initMouseDownListener() {
        
        if(!canvasRef.current) return;
        const listener = () =>{
            isDrawingRef.current = true;
        }
        mouseDownListenerRef.current = listener;
        canvasRef.current.addEventListener("mousedown", listener);
    }

    function initMouseUpListener() {
        const listener = () => {
            isDrawingRef.current = false;
        }
        mouseUpListenerRef.current = listener;
        window.addEventListener("mouseup", listener);
    }

    // calculates coordinates relative to the window
    function computePointInCanvas(clientX, clientY) {
        if(canvasRef.current){
            const boudingRect = canvasRef.current.getBoundingClientRect();
        return {
            x : clientX - boudingRect.left,
            y : clientY - boudingRect.top
            }
        } else {
            return null;
        }
        
    }

    // handles deleting current path
    function initDeletePath() {
        if(!canvasRef.current) return;
      
        const ctx = canvasRef.current.getContext('2d');
        if(delPath && deletePath) {
            deletePath(ctx);
            setDelPath(false);
            previousPointRef.current = null;
        }
        
    }

    return setCanvasRef;
};