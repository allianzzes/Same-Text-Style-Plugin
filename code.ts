
figma.showUI(__html__);
figma.ui.resize(500, 680);

// Check the selected text.

function checkSelection () {
    const selection = figma.currentPage.selection;

    //selection = 1 and a text layer
    if (selection.length === 1 && selection[0].type == "TEXT") {
        const textLayer = selection[0] as TextNode;

        figma.ui.postMessage({
            type: 'VALID SELECTION',
            fontFamily: textLayer.fontName !== figma.mixed ? textLayer.fontName.family: 'Mixed', 
            fontWeight: textLayer.fontName !== figma.mixed ? textLayer.fontName.style: 'Mixed',
            fontSize: textLayer.fontSize !== figma.mixed ? textLayer.fontSize: 'Mixed',
            lineHeight: textLayer.lineHeight !== figma.mixed ? textLayer.lineHeight: 'Mixed',
            letterSpacing: textLayer.letterSpacing !== figma.mixed ? textLayer.letterSpacing: 'Mixed',
            textCase: textLayer.textCase !== figma.mixed ? textLayer.textCase : 'Mixed',
            textStyleId: textLayer.textStyleId !== figma.mixed ? textLayer.textStyleId: 'Mixed'

        });
    } else {
        figma.ui.postMessage({type : 'INVALID_SELECTOR'});

    }
}

checkSelection();

figma.on("selectionchange", () => {
    checkSelection();
});

figma.ui.onmessage = async (msg) => {
    if (msg.type === 'EXECUTE_SEARCH') {
        const filters = msg.filters;
        const scope = msg.scope;

         let targetNodes: SceneNode[] = [];

         //Search area

        if (scope === "current-page") {
            //Find all text layers on the current active page
            targetNodes = figma.currentPage.findAll(node => node.type === "TEXT");
        } else {
            for (const page of figma.root.children) {
                const pageTextNodes = page.findAll(node => node.type === "TEXT");
                targetNodes = targetNodes.concat(pageTextNodes);
            }
        }

        const matchingLayers = targetNodes.filter((node => {
            const textNode = node as TextNode;

            //Font Family 
            if (filters.fontFamily) {
                const currentFamily = textNode.fontName !== figma.mixed ? textNode.fontName.family : 'Mixed';
                if (currentFamily !== filters.fontFamily) return false;
            }

            //Font Weight
            if (filters.fontWeight) {
                const currentWeight = textNode.fontName !== figma.mixed ? textNode.fontName.style : 'Mixed';
                if (currentWeight !== filters.fontWeight) return false;
            }

            //Font Size
            if (filters.fontSize) {
                const currentSize = textNode.fontSize !== figma.mixed ? textNode.fontSize : 'Mixed';
                if (currentSize !== filters.fontSize) return false;
            }

            //Line Height
            if (filters.lineHeight) {
                const currentHeight = textNode.lineHeight !== figma.mixed ? textNode.lineHeight : 'Mixed';
                if (currentHeight !== filters.lineHeight) return false;
            }

            //Letter Spacing 
            if (filters.letterSpacing) {
                const currentSpacing = textNode.letterSpacing !== figma.mixed ? textNode.letterSpacing : 'Mixed';
                if (currentSpacing !== filters.letterSpacing) return false;
            }

            //Text Case
            if (filters.textCase) {
                const currentCase = textNode.textCase !== figma.mixed ? textNode.textCase : 'Mixed';
                if (currentCase !== filters.textCase) return false;
            }

            //Applied Style 
            if (filters.appliedStyle) {
                const currentStyle = textNode.textStyleId !== figma.mixed ? textNode.textStyleId : 'Mixed';
                if (currentStyle !== filters.appliedStyle) return false;
            }

            return true; // Keeps the layer if it passed the rule checks^^
            
        }));

        if (matchingLayers.length > 0) {
            figma.currentPage.selection = matchingLayers;
            //Count layers that matched
            figma.ui.postMessage({ type: 'SEARCH_COMPLETE', count: matchingLayers.length});  

        } else {
            figma.ui.postMessage({ tyoe: 'SEARCH_COMPLETE', count: 0});
        }

    }

   
    
}

