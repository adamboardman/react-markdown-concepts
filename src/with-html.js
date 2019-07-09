'use strict'

const xtend = require('xtend')
const ReactMarkdownConcepts = require('./react-markdown-concepts')
const htmlParser = require('./plugins/html-parser')

const parseHtml = htmlParser()

function ReactMarkdownConceptsWithHtml(props) {
  const astPlugins = [parseHtml].concat(props.astPlugins || [])
  return ReactMarkdownConcepts(xtend(props, {astPlugins}))
}

ReactMarkdownConceptsWithHtml.defaultProps = ReactMarkdownConcepts.defaultProps
ReactMarkdownConceptsWithHtml.propTypes = ReactMarkdownConcepts.propTypes
ReactMarkdownConceptsWithHtml.types = ReactMarkdownConcepts.types
ReactMarkdownConceptsWithHtml.renderers = ReactMarkdownConcepts.renderers
ReactMarkdownConceptsWithHtml.uriTransformer = ReactMarkdownConcepts.uriTransformer

module.exports = ReactMarkdownConceptsWithHtml
