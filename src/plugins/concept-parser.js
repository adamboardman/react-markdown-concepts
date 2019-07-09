const tagsList = [];
const conceptsList = [];

function locator(value, fromIndex) {
    let retIndex = -1;
    tagsList.forEach(function (tag) {
        const index = value.indexOf(tag, fromIndex);
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
        tagsList.forEach(function (tag) {
            if (tagSelected === null && (value.substring(0, tag.length) === tag)) {
                tagSelected = tag;
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

            return eat(tagSelected)({
                type: 'link',
                url: "/concept/"+conceptSelected.index,
                children: [{
                    type: 'text',
                    position: {
                        start: eat.now(),
                        indent: []
                    },
                    value:tagSelected
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

