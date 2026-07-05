figma.showUI(__html__);

let isPluginChangingSelection = false;


function checkSelection() {

    if (isPluginChangingSelection) return;
    const selection = figma.currentPage.selection;

    if (selection.length === 1 && selection[0].type === "TEXT") {
        const textLayer = selection[0] as TextNode; 

        // Resolve Style ID to a readable design token name if it exists
        let styleName = 'None';
        if (textLayer.textStyleId !== figma.mixed && textLayer.textStyleId !== '') {
            const style = figma.getStyleById(textLayer.textStyleId as string);
            if (style) styleName = style.name;
        }

        figma.ui.postMessage({
            type: 'VALID_SELECTION',
            fontFamily: textLayer.fontName !== figma.mixed ? textLayer.fontName.family : 'Mixed', 
            fontWeight: textLayer.fontName !== figma.mixed ? textLayer.fontName.style : 'Mixed',
            fontSize: textLayer.fontSize !== figma.mixed ? String(textLayer.fontSize) : 'Mixed',
            lineHeight: textLayer.lineHeight !== figma.mixed ? (textLayer.lineHeight.unit === 'AUTO' ? 'Auto' : 'Custom') : 'Mixed',
            letterSpacing: textLayer.letterSpacing !== figma.mixed ? String(textLayer.letterSpacing.value) : 'Mixed',
            textCase: textLayer.textCase !== figma.mixed ? textLayer.textCase : 'Mixed',
            appliedStyle: styleName

            
        });

        figma.ui.resize(500,740);

    } else {
        figma.ui.postMessage({ type: 'INVALID_SELECTION' });
        
        figma.ui.resize(500, 580);
    }
}

checkSelection();

figma.on("selectionchange", () => {
    checkSelection();
});

figma.ui.onmessage = async (msg) => {
    if (msg.type === 'EXECUTE_SEARCH') {
        isPluginChangingSelection = true;
        const filters = msg.filters;
        const scope = msg.scope;
        let targetNodes: SceneNode[] = [];

        if (scope === "current-page") {
            targetNodes = figma.currentPage.findAll(node => node.type === "TEXT");
        } else {
            for (const page of figma.root.children) {
                const pageTextNodes = page.findAll(node => node.type === "TEXT");
                targetNodes = targetNodes.concat(pageTextNodes);
            }
        }

        const matchingLayers = targetNodes.filter(node => {
            const textNode = node as TextNode;

            if (filters.fontFamily) {
                const currentFamily = textNode.fontName !== figma.mixed ? textNode.fontName.family : 'Mixed';
                if (currentFamily !== filters.fontFamily) return false;
            }

            if (filters.fontWeight) {
                const currentWeight = textNode.fontName !== figma.mixed ? textNode.fontName.style : 'Mixed';
                if (currentWeight !== filters.fontWeight) return false;
            }

            if (filters.fontSize) {
                const currentSize = textNode.fontSize !== figma.mixed ? String(textNode.fontSize) : 'Mixed';
                if (currentSize !== filters.fontSize) return false;
            }

            if (filters.lineHeight) {
                const currentHeight = textNode.lineHeight !== figma.mixed ? (textNode.lineHeight.unit === 'AUTO' ? 'Auto' : 'Custom') : 'Mixed';
                if (currentHeight !== filters.lineHeight) return false;
            }

            if (filters.letterSpacing) {
                const currentSpacing = textNode.letterSpacing !== figma.mixed ? String(textNode.letterSpacing.value) : 'Mixed';
                if (currentSpacing !== filters.letterSpacing) return false;
            }

            if (filters.textCase) {
                const currentCase = textNode.textCase !== figma.mixed ? textNode.textCase : 'Mixed';
                if (currentCase !== filters.textCase) return false;
            }

            if (filters.appliedStyleName) {
                let currentStyleName = 'None';
                if (textNode.textStyleId !== figma.mixed && textNode.textStyleId !== '') {
                    const style = figma.getStyleById(textNode.textStyleId as string);
                    if (style) currentStyleName = style.name;
                }
                if (currentStyleName !== filters.appliedStyleName) return false;
            }

            return true;
        });

        if (matchingLayers.length > 0) {
            figma.currentPage.selection = matchingLayers;
            figma.ui.postMessage({ type: 'SEARCH_COMPLETE', count: matchingLayers.length });  
        } else {
            figma.ui.postMessage({ type: 'SEARCH_COMPLETE', count: 0 });
        }

        setTimeout(() => {
            isPluginChangingSelection =false;
        }, 100);
    } 

};