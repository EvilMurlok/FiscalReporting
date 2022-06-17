const LETTERS = (() => {
    const tempLetters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const readyLetters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    for (let i = 0; i < 6; ++i) {
        for (let j = 0; j < 26; ++j) {
            readyLetters.push(`${tempLetters[i]}${readyLetters[j]}`);
        }
    }
    return readyLetters;
})();
const BORDER = {
    top: {style: "thin", color: {argb: 'rgba(0,0,0,0)'}},
    left: {style: "thin", color: {argb: 'rgba(0,0,0,0)'}},
    bottom: {style: "thin", color: {argb: 'rgba(0,0,0,0)'}},
    right: {style: "thin", color: {argb: 'rgba(0,0,0,0)'}}
};
const FILL = (color) => {
    return {type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: color},}
};

const ALIGN_TOP = {vertical: 'middle', horizontal: 'center'};

const convertCell = (cell, color = "ffff7b") => {
    cell.fill = FILL(color);
    cell.alignment = ALIGN_TOP;
    cell.font = {bold: true};
}



module.exports = {
    LETTERS,
    BORDER,
    FILL,
    ALIGN_TOP,
    convertCell
}