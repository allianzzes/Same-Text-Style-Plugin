
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




