const tagsList = [];
const conceptsList = [];

function locator(value, fromIndex) {
    let retIndex = -1;
    const lowerValue = value.toLowerCase();
    tagsList.forEach(function (tag) {
        const index = lowerValue.indexOf(tag, fromIndex);
        if (index > -1 && (index < retIndex || retIndex === -1)) {
            retIndex = index;
        }
    });

    return retIndex;
}

module.exports = function inlinePlugin(concepts) {
    conceptsList.push(...concepts);
    concepts.forEach(function (concept) {
        tagsList.push(...concept.tags)
    });
    tagsList.sort(function (a, b) {
        return b.length - a.length
    });

    function inlineTokenizer(eat, value, silent) {
        let tagSelected = null;
        let caseValueSelected = null;
        const lowerValue = value.toLowerCase();
        tagsList.forEach(function (tag) {
            if (tagSelected === null && (lowerValue.substring(0, tag.length) === tag)) {
                tagSelected = tag;
                caseValueSelected = value.substring(0, tag.length);
            }
        });
        if (tagSelected !== null) {
            if (silent) {
                return true
            }

            let conceptSelected = null;
            conceptsList.forEach(function (concept) {
                if (concept.tags.indexOf(tagSelected) !== -1) {
                    conceptSelected = concept;
                }
            });

            return eat(caseValueSelected)({
                type: 'span',
                children: [{
                    type: 'hiderLink',
                    id: `a-${conceptSelected.index}-${eat.now().line}-${eat.now().column}`,
                    position: {
                        start: eat.now(),
                        indent: []
                    },
                    url: `/concept/${conceptSelected.index}`,
                    conceptIndex: `${conceptSelected.index}-${eat.now().line}-${eat.now().column}`,
                    children: [{
                        type: 'text',
                        position: {
                            start: eat.now(),
                            indent: []
                        },
                        value: caseValueSelected
                    }]
                }, {
                    type: 'span',
                    id: `s-${conceptSelected.index}-${eat.now().line}-${eat.now().column}`,
                    className: "hidden-span",
                    position: {
                        start: eat.now(),
                        indent: []
                    },
                    children: [{
                        type: 'link',
                        position: {
                            start: eat.now(),
                            indent: []
                        },
                        url: `/concept/${conceptSelected.index}`,
                        children: [{
                            type: 'text',
                            position: {
                                start: eat.now(),
                                indent: []
                            },
                            value: ` ${conceptSelected.summary}`
                        }]
                    }]
                }]
            })
        }
    }

    inlineTokenizer.notInLink = true;
    inlineTokenizer.locator = locator;

    const Parser = this.Parser;

    // Inject inlineTokenizer
    const inlineTokenizers = Parser.prototype.inlineTokenizers;
    const inlineMethods = Parser.prototype.inlineMethods;
    inlineTokenizers.concepts = inlineTokenizer;
    inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'concepts');
};

