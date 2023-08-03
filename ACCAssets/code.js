"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const focusOrderGroupName = "Accessibility Design Tools - Focus Order";
const focusOrderSubGroupName = "FO";
const focusOrderSymbolName = "FOCircle";
const focusOrderTextName = "FOText";
const focusOrderRectName = "FORect";
const readingOrderGroupName = "Accessibility Design Tools - Reading Order";
const readingOrderSubGroupName = "RO";
const readingOrderSymbolName = "ROHexagon";
const readingOrderTextName = "ROText";
const readingOrderRectName = "RORect";
const landmarkOrderGroupName = "Accessibility Design Tools - Landmarks";
const landmarkOrderSubGroupName = "L";
const landmarkOrderSymbolName = "LRole";
const landmarkOrderTextName = "LRoleName";
const landmarkOrderRectName = "LBounds";
const headingOrderGroupName = "Accessibility Design Tools - Headings";
const headingOrderSubGroupName = "H";
const headingOrderSymbolName = "HFrame";
const headingOrderTextName = "HText";
const headingOrderRectName = "HBounds";
const headingOrderArrowName = "HPointer";
const stepSize = 30;
const stepFontSize = 14;
var selectedNodes = []; // existing Figma nodes in page
var createdNodes = []; // created Figma nodes in plugin
var focusGroup;
var readingGroup;
var landmarkGroup;
var headingGroup;
var gnode; // To check if Group node was already generated
const messagemap = {
    zoomfactor: 1,
    themeindex: 0,
    nodearray: [""] // Array for node sequence and params
};
// Flags
figma.skipInvisibleInstanceChildren = true; // Performance
// Persistency ----------------------------------------------------------------------------------------------
// restore previous size
figma.clientStorage.getAsync('size').then(size => {
    if (size) {
        if (size.w < 400)
            size.w = 400;
        if (size.h < 300)
            size.h = 300;
        figma.ui.resize(size.w, size.h);
    }
}).catch(err => { });
// restore settings zoom factor
figma.clientStorage.getAsync('zoom').then(zoom => {
    if (zoom) {
        messagemap.zoomfactor = zoom;
        figma.ui.postMessage(messagemap);
    }
}).catch(err => { });
// restore settings theme
figma.clientStorage.getAsync('theme').then(theme => {
    if (theme) {
        messagemap.themeindex = theme;
        figma.ui.postMessage(messagemap);
    }
}).catch(err => { });
// FOCUS ORDER DIALOG ---------------------------------------------------------------------------------------
if (figma.command === "focusorder") {
    figma.showUI(__uiFiles__.focusorder, { width: 400, height: 300 });
    //Check if a Focus Order Group has been selected in Layers pane
    var node = figma.currentPage.selection[0];
    if (node && node.type == "GROUP" && node.name == focusOrderGroupName) {
        gnode = node; // assign to variable for Focus Group node already generated
        for (let i = 0; i < gnode.children.length; i++) {
            var id = gnode.children[i].getPluginData("identifier");
            var name = gnode.children[i].getPluginData("nodename");
            var variant = gnode.children[i].getPluginData("FocusOrderVariant");
            let attr = [name, id, variant];
            messagemap.nodearray = attr;
            figma.ui.postMessage(messagemap);
        }
    }
}
// READING ORDER DIALOG ---------------------------------------------------------------------------------------
if (figma.command === "readingorder") {
    figma.showUI(__uiFiles__.readingorder, { width: 400, height: 300 });
    //Check if a Reading Order Group has been selected in Layers pane
    var node = figma.currentPage.selection[0];
    if (node && node.type == "GROUP" && node.name == readingOrderGroupName) {
        gnode = node; // assign to variable for Reading Group node already generated
        for (let i = 0; i < gnode.children.length; i++) {
            var id = gnode.children[i].getPluginData("identifier");
            var name = gnode.children[i].getPluginData("nodename");
            var multiple = gnode.children[i].getPluginData("isBranch");
            let attr = [name, id, multiple];
            messagemap.nodearray = attr;
            figma.ui.postMessage(messagemap);
        }
    }
}
// LANDMARK ORDER DIALOG ---------------------------------------------------------------------------------------
if (figma.command === "landmarks") {
    figma.showUI(__uiFiles__.landmarks, { width: 400, height: 300 });
    //Check if a Landmark group has been selected in Layers pane
    var node = figma.currentPage.selection[0];
    if (node && node.type == "GROUP" && node.name == landmarkOrderGroupName) {
        gnode = node; // assign to variable for Landmark Group node already generated
        for (let i = 0; i < gnode.children.length; i++) {
            var id = gnode.children[i].getPluginData("identifier");
            var name = gnode.children[i].getPluginData("nodename");
            var landmarkname = gnode.children[i].getPluginData("LandmarkName");
            let attr = [name, id, landmarkname];
            messagemap.nodearray = attr;
            figma.ui.postMessage(messagemap);
        }
    }
}
// HEADING ORDER DIALOG ---------------------------------------------------------------------------------------
if (figma.command === "headings") {
    figma.showUI(__uiFiles__.headings, { width: 500, height: 300 });
    //Check if a Heading group has been selected in Layers pane
    var node = figma.currentPage.selection[0];
    if (node && node.type == "GROUP" && node.name == headingOrderGroupName) {
        gnode = node; // assign to variable for Heading Group node already generated
        for (let i = 0; i < gnode.children.length; i++) {
            var id = gnode.children[i].getPluginData("identifier");
            var name = gnode.children[i].getPluginData("nodename");
            var level = gnode.children[i].getPluginData("HeadingLevel");
            var invisible = gnode.children[i].getPluginData("isInvisible");
            var invisibleText = gnode.children[i].getPluginData("InvisibleText");
            let attr = [name, id, level, invisible, invisibleText];
            messagemap.nodearray = attr;
            figma.ui.postMessage(messagemap);
        }
    }
}
// MESSAGE HANDLING ----------------------------------------------------------------------------------------
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
    yield figma.loadFontAsync({ family: "Inter", style: "Bold Italic" });
    switch (msg.type) {
        case "resize":
            figma.ui.resize(msg.size.w, msg.size.h);
            figma.clientStorage.setAsync('size', msg.size).catch(err => { }); // save size    
            break;
        case "zoom":
            figma.clientStorage.getAsync('size').then(size => {
                if (size) {
                    var newsizeW = Math.round(parseInt(size.w) * msg.zoom);
                    var newsizeH = Math.round(parseInt(size.h) * msg.zoom);
                    figma.ui.resize(newsizeW, newsizeH);
                }
            }).catch(err => { }); // resize plugin windo according to zoom factor              
            messagemap.zoomfactor = msg.zoom;
            figma.clientStorage.setAsync('zoom', msg.zoom).catch(err => { }); // save zoom factor          
            break;
        case "theme":
            messagemap.themeindex = msg.theme;
            figma.clientStorage.setAsync('theme', msg.theme).catch(err => { }); // save theme ID    
            break;
        case "gettheme":
            figma.clientStorage.getAsync('theme').then(theme => {
                if (theme) {
                    messagemap.themeindex = theme;
                    figma.ui.postMessage(messagemap);
                }
            }).catch(err => { });
            break;
        case "quit":
            figma.closePlugin();
            break;
        default:
            break;
    }
    if (msg.type === 'addFocusOrder' || msg.type === 'addReadingOrder' || msg.type === 'addLandmarkOrder' || msg.type === 'addHeadingOrder') {
        var node = figma.currentPage.selection[0];
        var attr = [];
        if (node) {
            switch (msg.type) { // add with defaults for values
                case "addFocusOrder":
                    attr = [node.name, node.id, "1"];
                    break;
                case "addReadingOrder":
                    attr = [node.name, node.id, "false"];
                    break;
                case "addLandmarkOrder":
                    attr = [node.name, node.id, "Region"];
                    break;
                case "addHeadingOrder":
                    attr = [node.name, node.id, "H1", "false", "text"];
                    break;
                default:
                    break;
            }
            messagemap.nodearray = attr;
            figma.ui.postMessage(messagemap);
        }
    }
    if (msg.type === 'createFocusOrder') {
        for (let i = 0; i < msg.items.length; i++) {
            //Find node with that ID in figma page
            //const node = figma.currentPage.findOne(n => n.id === msg.items[i])      
            const node = findNode(msg.items[i]);
            if (node) {
                selectedNodes.push(node);
                selectedNodes[selectedNodes.length - 1].setPluginData("FocusOrderVariant", msg.varitems[i]);
            }
        }
        const g = createFocusGroup();
        if (g != undefined)
            nodeSelect(g.id);
        // check if we have modded a Group, if so, delete the old group
        if (gnode != undefined)
            gnode.remove();
        figma.closePlugin();
    }
    if (msg.type === 'createReadingOrder') {
        for (let i = 0; i < msg.items.length; i++) {
            //Find node with that ID in figma page
            //const node = figma.currentPage.findOne(n => n.id === msg.items[i])
            const node = findNode(msg.items[i]);
            if (node) {
                selectedNodes.push(node);
                selectedNodes[selectedNodes.length - 1].setPluginData("isBranch", "false");
                if (msg.bitems.findIndex((element) => element == msg.items[i]) != -1)
                    selectedNodes[selectedNodes.length - 1].setPluginData("isBranch", "true");
            }
        }
        const g = createReadingGroup();
        if (g != undefined)
            nodeSelect(g.id);
        // check if we have modded a Group, if so, delete the old group
        if (gnode != undefined)
            gnode.remove();
        figma.closePlugin();
    }
    if (msg.type === 'createLandmarkOrder') {
        for (let i = 0; i < msg.items.length; i++) {
            //Find node with that ID in figma page
            //const node = figma.currentPage.findOne(n => n.id === msg.items[i])
            const node = findNode(msg.items[i]);
            if (node) {
                selectedNodes.push(node);
                selectedNodes[selectedNodes.length - 1].setPluginData("LandmarkName", msg.varitems[i]);
            }
        }
        const g = createLandmarkGroup();
        if (g != undefined)
            nodeSelect(g.id);
        // check if we have modded a Group, if so, delete the old group
        if (gnode != undefined)
            gnode.remove();
        figma.closePlugin();
    }
    if (msg.type === 'createHeadingOrder') {
        for (let i = 0; i < msg.items.length; i++) {
            //Find node with that ID in figma page
            //const node = figma.currentPage.findOne(n => n.id === msg.items[i])
            const node = findNode(msg.items[i]);
            if (node) {
                selectedNodes.push(node);
                selectedNodes[selectedNodes.length - 1].setPluginData("HeadingLevel", msg.varitems[i]);
                selectedNodes[selectedNodes.length - 1].setPluginData("isInvisible", "false");
                if (msg.bitems.findIndex((element) => element == msg.items[i]) != -1) {
                    selectedNodes[selectedNodes.length - 1].setPluginData("isInvisible", "true");
                }
                selectedNodes[selectedNodes.length - 1].setPluginData("InvisibleText", msg.paritems[i]);
            }
        }
        const g = createHeadingGroup();
        if (g != undefined)
            nodeSelect(g.id);
        // check if we have modded a Group, if so, delete the old group
        if (gnode != undefined)
            gnode.remove();
        figma.closePlugin();
    }
    if (msg.type === 'highlightSceneNode') {
        nodeSelect(msg.id);
    }
    // Delete a single node
    if (msg.type === 'deleteFocusItem' || msg.type === 'deleteReadingOrderItem'
        || msg.type === 'deleteLandmarkItem' || msg.type === 'deleteHeadingItem') {
        try {
            //TODO: add deletion code       
        }
        catch (ex) {
            console.error('Delete Item: ', ex.message);
        }
    }
    // Remove all nodes
    if (msg.type === 'clearFocusOrder' || msg.type === 'clearReadingOrder'
        || msg.type === 'clearLandmarkOrder' || msg.type === 'clearHeadingOrder') {
        try {
            selectedNodes.length = 0;
            createdNodes.length = 0;
        }
        catch (ex) {
            console.error('Clear Order: ', ex.message);
        }
    }
});
// HELPERS
function findNode(id) {
    const node = figma.getNodeById(id);
    return node;
}
function nodeSelect(id) {
    //Find node with that ID in figma page
    const node = findNode(id);
    if (node) { // select if found
        const newSelection = [];
        newSelection.push(node);
        figma.currentPage.selection = newSelection;
    }
}
// LAYER FACTORY FUNCTIONS -----------------------------------------------------------------------------------------------------------
function createFocusGroup() {
    if (!selectedNodes) {
        return;
    }
    if (selectedNodes.length < 1) {
        return;
    }
    createdNodes.length = 0;
    for (let i = 0; i < selectedNodes.length; i++) {
        createFocusStep(selectedNodes, i);
    }
    focusGroup = figma.group(createdNodes, figma.currentPage);
    focusGroup.name = focusOrderGroupName;
    focusGroup.expanded = false;
    focusGroup.locked = false; // allows to rearrange more easy
    figma.currentPage.appendChild(focusGroup);
    figma.notify(focusOrderGroupName + " with " + selectedNodes.length + " nodes created");
    selectedNodes.length = 0;
    return focusGroup;
}
function createReadingGroup() {
    if (!selectedNodes) {
        return;
    }
    if (selectedNodes.length < 1) {
        return;
    }
    createdNodes.length = 0;
    for (let i = 0; i < selectedNodes.length; i++) {
        createReadingStep(selectedNodes, i);
    }
    readingGroup = figma.group(createdNodes, figma.currentPage);
    readingGroup.name = readingOrderGroupName;
    readingGroup.expanded = false;
    readingGroup.locked = false; // allows to rearrange more easy
    figma.currentPage.appendChild(readingGroup);
    figma.notify(readingOrderGroupName + " with " + selectedNodes.length + " nodes created");
    selectedNodes.length = 0;
    return readingGroup;
}
function createLandmarkGroup() {
    if (!selectedNodes) {
        return;
    }
    if (selectedNodes.length < 1) {
        return;
    }
    createdNodes.length = 0;
    for (let i = 0; i < selectedNodes.length; i++) {
        createLandmarkStep(selectedNodes, i);
    }
    landmarkGroup = figma.group(createdNodes, figma.currentPage);
    landmarkGroup.name = landmarkOrderGroupName;
    landmarkGroup.expanded = false;
    landmarkGroup.locked = false; // allows to rearrange more easy
    figma.currentPage.appendChild(landmarkGroup);
    figma.notify(landmarkOrderGroupName + " with " + selectedNodes.length + " nodes created");
    selectedNodes.length = 0;
    return landmarkGroup;
}
function createHeadingGroup() {
    if (!selectedNodes) {
        return;
    }
    if (selectedNodes.length < 1) {
        return;
    }
    createdNodes.length = 0;
    for (let i = 0; i < selectedNodes.length; i++) {
        createHeadingStep(selectedNodes, i);
    }
    headingGroup = figma.group(createdNodes, figma.currentPage);
    headingGroup.name = headingOrderGroupName;
    headingGroup.expanded = false;
    headingGroup.locked = false; // allows to rearrange more easy
    figma.currentPage.appendChild(headingGroup);
    figma.notify(headingOrderGroupName + " with " + selectedNodes.length + " nodes created");
    selectedNodes.length = 0;
    return headingGroup;
}
function createFocusStep(n, i) {
    //var array = ["Single","Horizontal","Vertical","Both"]; // 1,2,3,4
    const t = n[i].absoluteTransform;
    const x = t[0][2];
    const y = t[1][2];
    // Bounding Rect
    const rect = figma.createRectangle();
    rect.x = x;
    rect.y = y;
    rect.resize(n[i].width, n[i].height);
    if (n[i].getPluginData("FocusOrderVariant") == "1") {
        rect.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
        rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    }
    else {
        rect.strokes = [{ type: 'SOLID', color: { r: 235 / 255, g: 113 / 255, b: 0 } }];
        rect.strokeWeight = 2;
        rect.strokeAlign = "OUTSIDE";
        //rect.dashPattern = [4,2];
        rect.cornerRadius = 10;
        rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    }
    rect.name = focusOrderRectName + (i + 1).toString();
    // Circle
    const circle = figma.createEllipse();
    circle.strokeWeight = 3;
    circle.x = x - stepSize / 2;
    circle.y = y - stepSize / 2;
    circle.resize(stepSize, stepSize);
    if (n[i].getPluginData("FocusOrderVariant") == "1") { // Single
        circle.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        circle.strokes = [{ type: 'SOLID', color: { r: 235 / 255, g: 113 / 255, b: 0 } }];
    }
    else { // Multiple
        circle.fills = [{ type: 'SOLID', color: { r: 235 / 255, g: 113 / 255, b: 0 } }];
        circle.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    }
    circle.effects = [{ type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.25 },
            blendMode: 'NORMAL',
            offset: { x: 0, y: 4 },
            radius: 4,
            spread: 0,
            visible: true }];
    circle.name = focusOrderSymbolName + (i + 1).toString();
    // Number
    const label = createStepText(circle, i, focusOrderTextName);
    // Group 
    var fgroup;
    //inner function
    function returnfGroup() {
        function getKeyRect(px, py) {
            const r = figma.createRectangle();
            r.x = px;
            r.y = py;
            r.resize(20, 20);
            r.cornerRadius = 4;
            r.fills = [{ type: 'SOLID', color: { r: 235 / 255, g: 113 / 255, b: 0 } }];
            return r;
        }
        function getKeySymbol(px, py, r) {
            const p = figma.createPolygon();
            p.x = px;
            p.y = py;
            p.rotation = r;
            p.resize(10, 10);
            p.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            return p;
        }
        if (n[i].getPluginData("FocusOrderVariant") == "1") {
            let nodes = [circle, label, rect]; // default
            fgroup = figma.group(nodes, figma.currentPage);
        }
        if (n[i].getPluginData("FocusOrderVariant") == "2") {
            let nodes = [circle, label, rect, getKeyRect(x + n[i].width / 2 - 20 - 2, y + 2), getKeyRect(x + n[i].width / 2 + 2, y + 2),
                getKeySymbol(x + n[i].width / 2 - 20 - 2 + 5, y + 2 + 15, 90), getKeySymbol(x + n[i].width / 2 + 15 + 2, y + 2 + 5, -90)];
            fgroup = figma.group(nodes, figma.currentPage);
        }
        if (n[i].getPluginData("FocusOrderVariant") == "3") {
            let nodes = [circle, label, rect, getKeyRect(x + n[i].width - 24, y + n[i].height / 2 - 20 - 2), getKeyRect(x + n[i].width - 24, y + n[i].height / 2 + 2),
                getKeySymbol(x + n[i].width - 24 + 5, y + n[i].height / 2 - 20 + 3, 0), getKeySymbol(x + n[i].width - 14 + 5, y + n[i].height / 2 + 20 - 3, 180)];
            fgroup = figma.group(nodes, figma.currentPage);
        }
        if (n[i].getPluginData("FocusOrderVariant") == "4") {
            let nodes = [circle, label, rect, getKeyRect(x + n[i].width / 2 - 20 - 2, y + 2), getKeyRect(x + n[i].width / 2 + 2, y + 2),
                getKeyRect(x + n[i].width - 24, y + n[i].height / 2 - 20 - 2), getKeyRect(x + n[i].width - 24, y + n[i].height / 2 + 2),
                getKeySymbol(x + n[i].width / 2 - 20 - 2 + 5, y + 2 + 15, 90), getKeySymbol(x + n[i].width / 2 + 15 + 2, y + 2 + 5, -90),
                getKeySymbol(x + n[i].width - 24 + 5, y + n[i].height / 2 - 20 + 3, 0), getKeySymbol(x + n[i].width - 14 + 5, y + n[i].height / 2 + 20 - 3, 180)];
            fgroup = figma.group(nodes, figma.currentPage);
        }
        return fgroup;
    }
    fgroup = returnfGroup();
    fgroup.setPluginData("identifier", n[i].id);
    fgroup.setPluginData("nodename", n[i].name);
    fgroup.setPluginData("FocusOrderVariant", n[i].getPluginData("FocusOrderVariant"));
    fgroup.name = focusOrderSubGroupName + (i + 1).toString();
    fgroup.expanded = false;
    fgroup.locked = false; // allows to rearrange more easy
    createdNodes.push(fgroup);
}
function createReadingStep(n, i) {
    const t = n[i].absoluteTransform;
    const x = t[0][2];
    const y = t[1][2];
    // Bounding Rect
    const rect = figma.createRectangle();
    rect.x = x;
    rect.y = y;
    rect.resize(n[i].width, n[i].height);
    rect.strokeWeight = 1;
    rect.strokeAlign = "OUTSIDE";
    rect.dashPattern = [4, 0];
    rect.cornerRadius = 2;
    rect.name = readingOrderRectName + (i + 1).toString();
    if (n[i].getPluginData("isBranch") == "true") {
        rect.strokes = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 } }];
        rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    }
    else {
        rect.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
        rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    }
    const hexagon = figma.createPolygon();
    hexagon.pointCount = 6;
    hexagon.x = x - stepSize;
    hexagon.y = y + (n[i].height - stepSize) / 2;
    hexagon.resize(stepSize, stepSize);
    hexagon.strokes = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 } }];
    hexagon.strokeWeight = 3;
    if (n[i].getPluginData("isBranch") == "true")
        hexagon.fills = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 } }];
    else
        hexagon.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    hexagon.effects = [{ type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.25 },
            blendMode: 'NORMAL',
            offset: { x: 0, y: 4 },
            radius: 4,
            spread: 0,
            visible: true }];
    hexagon.name = readingOrderSymbolName + (i + 1).toString();
    const label = createStepText(hexagon, i, readingOrderTextName);
    if (n[i].getPluginData("isBranch") == "true")
        label.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    else
        label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    var rgroup;
    let nodes = [rect, hexagon, label];
    rgroup = figma.group(nodes, figma.currentPage);
    rgroup.setPluginData("identifier", n[i].id);
    rgroup.setPluginData("nodename", n[i].name);
    rgroup.setPluginData("isBranch", n[i].getPluginData("isBranch"));
    rgroup.name = readingOrderSubGroupName + (i + 1).toString();
    rgroup.expanded = false;
    rgroup.locked = false; // allows to rearrange more easy
    createdNodes.push(rgroup);
}
function createLandmarkStep(n, i) {
    const t = n[i].absoluteTransform;
    const x = t[0][2];
    const y = t[1][2];
    // Bounding Rect
    const rect = figma.createRectangle();
    rect.x = x;
    rect.y = y;
    rect.resize(n[i].width, n[i].height);
    rect.strokes = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 } }];
    rect.strokeWeight = 2;
    rect.strokeAlign = "OUTSIDE";
    rect.cornerRadius = 2;
    rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    rect.name = landmarkOrderRectName + (i + 1).toString();
    // Landmark Role Rectangle
    const lrect = figma.createRectangle();
    if (n[i].getPluginData("LandmarkName") == "Main")
        lrect.x = x + rect.width / 2 - 120 / 2;
    else
        lrect.x = x + rect.width - 120;
    lrect.y = y;
    lrect.resize(120, 24);
    lrect.strokeAlign = "OUTSIDE";
    lrect.cornerRadius = 2;
    lrect.strokes = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 } }];
    lrect.strokeWeight = 2;
    lrect.fills = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 } }];
    lrect.effects = [{ type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.25 },
            blendMode: 'NORMAL',
            offset: { x: 0, y: 4 },
            radius: 4,
            spread: 0,
            visible: true }];
    lrect.name = landmarkOrderSymbolName + (i + 1).toString();
    const label = createStepText(lrect, i, landmarkOrderTextName);
    label.characters = n[i].getPluginData("LandmarkName");
    label.fontSize = stepFontSize;
    label.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    var lgroup;
    let nodes = [rect, lrect, label];
    lgroup = figma.group(nodes, figma.currentPage);
    lgroup.setPluginData("identifier", n[i].id);
    lgroup.setPluginData("nodename", n[i].name);
    lgroup.setPluginData("LandmarkName", n[i].getPluginData("LandmarkName"));
    lgroup.name = label.characters;
    lgroup.expanded = false;
    lgroup.locked = false; // allows to rearrange more easy
    createdNodes.push(lgroup);
}
function createHeadingStep(n, i) {
    const t = n[i].absoluteTransform;
    const x = t[0][2];
    const y = t[1][2];
    // Bounding Rect
    const rect = figma.createRectangle();
    rect.x = x;
    rect.y = y;
    rect.resize(n[i].width, n[i].height);
    rect.strokes = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 }, opacity: 0 }];
    rect.strokeWeight = 1;
    rect.strokeAlign = "OUTSIDE";
    rect.dashPattern = [1, 1];
    rect.cornerRadius = 1;
    rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    rect.name = headingOrderRectName + (i + 1).toString();
    if (n[i].getPluginData("isInvisible") == "true") {
        rect.strokes = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 }, opacity: 1 }];
    }
    // Heading Role Frame
    var lframe = null;
    lframe = figma.createFrame();
    lframe.name = headingOrderSymbolName + (i + 1).toString();
    lframe.layoutGrow = 0;
    lframe.primaryAxisSizingMode = "AUTO";
    lframe.counterAxisSizingMode = "AUTO";
    lframe.primaryAxisAlignItems = "CENTER";
    lframe.counterAxisAlignItems = "CENTER";
    lframe.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
    lframe.layoutMode = "HORIZONTAL";
    lframe.clipsContent = false;
    lframe.layoutAlign = "STRETCH";
    lframe.horizontalPadding = 10;
    lframe.verticalPadding = 10;
    //lframe.x = x + rect.width + 22;
    lframe.y = y + rect.height / 2 - 20;
    lframe.strokeAlign = "OUTSIDE";
    lframe.cornerRadius = 2;
    lframe.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    lframe.strokeWeight = 1;
    lframe.fills = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 } }];
    lframe.effects = [{ type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.25 },
            blendMode: 'NORMAL',
            offset: { x: 0, y: 4 },
            radius: 4,
            spread: 0,
            visible: true }];
    if (n[i].getPluginData("isInvisible") == "true") {
        lframe.strokes = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 } }];
        lframe.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    }
    // Heading Role Arrow
    const arrow = figma.createPolygon();
    arrow.rotation = -90;
    arrow.resize(20, 15);
    arrow.x = x - 5;
    arrow.y = lframe.y + arrow.height / 2 + 2;
    arrow.strokeAlign = "OUTSIDE";
    arrow.cornerRadius = 0;
    arrow.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    arrow.strokeWeight = 1;
    arrow.fills = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 } }];
    arrow.effects = [{ type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.25 },
            blendMode: 'NORMAL',
            offset: { x: 0, y: 4 },
            radius: 4,
            spread: 0,
            visible: true }];
    arrow.name = headingOrderArrowName + (i + 1).toString();
    const label = createFrameText(lframe, i, headingOrderTextName);
    label.fontSize = stepFontSize + 4;
    if (n[i].getPluginData("isInvisible") == "true") {
        label.fills = [{ type: 'SOLID', color: { r: 145 / 255, g: 0 / 255, b: 195 / 255 } }];
        label.characters = "Invisible " + n[i].getPluginData("HeadingLevel") + ": " + n[i].getPluginData("InvisibleText");
        if (n[i].getPluginData("InvisibleText").length > 0)
            label.setRangeFontName(14, label.characters.length, { family: "Inter", style: "Bold Italic" });
    }
    else { // regular case  
        label.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        label.characters = n[i].getPluginData("HeadingLevel");
    }
    lframe.appendChild(label);
    lframe.x = x - lframe.width - 22;
    let nodes = [rect, lframe, arrow, label];
    var hgroup;
    hgroup = figma.group(nodes, figma.currentPage);
    hgroup.setPluginData("identifier", n[i].id);
    hgroup.setPluginData("nodename", n[i].name);
    hgroup.setPluginData("HeadingLevel", n[i].getPluginData("HeadingLevel"));
    hgroup.setPluginData("isInvisible", n[i].getPluginData("isInvisible"));
    hgroup.setPluginData("InvisibleText", n[i].getPluginData("InvisibleText"));
    if (n[i].getPluginData("isInvisible") == "true") {
        if (n[i].getPluginData("InvisibleText").length > 0)
            hgroup.name = "I" + n[i].getPluginData("HeadingLevel").toString() + ": " + n[i].getPluginData("InvisibleText");
        else
            hgroup.name = "I" + n[i].getPluginData("HeadingLevel").toString();
    }
    else {
        hgroup.name = n[i].getPluginData("HeadingLevel").toString();
    }
    hgroup.expanded = false;
    hgroup.locked = false; // allows to rearrange more easy
    createdNodes.push(hgroup);
}
// declared separately because of reuse
function createStepText(scn, i, name) {
    const label = figma.createText();
    label.fontName = { family: "Inter", style: "Bold" };
    label.fontSize = stepFontSize;
    label.name = name + (i + 1).toString();
    label.x = scn.x + scn.width / 2;
    label.y = scn.y + scn.height / 2 - label.fontSize / 2 - 2;
    label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    label.textAlignHorizontal = "CENTER";
    label.textAlignVertical = "CENTER";
    label.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
    label.characters = (i + 1).toString();
    return label;
}
function createFrameText(scn, i, name) {
    const label = figma.createText();
    label.fontName = { family: "Inter", style: "Bold" };
    label.fontSize = stepFontSize;
    label.name = name + (i + 1).toString();
    label.x = 0;
    label.y = 0;
    label.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    label.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
    label.textAlignHorizontal = "CENTER";
    label.textAlignVertical = "CENTER";
    label.characters = (i + 1).toString();
    return label;
}
