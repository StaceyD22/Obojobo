require('./module-permissions-dialog.scss')

const React = require('react')
const ModuleIamge = require('./module-image')
const Button = require('./button')
const ButtonLink = require('./button-link')
const { urlForEditor } = require('../repository-utils')
const {
	downloadDocument
} = require('obojobo-document-engine/src/scripts/common/util/download-document')

const deleteModule = (title, draftId, deleteFn) => {
	const response = confirm(`Delete "${title}" id: ${draftId} ?`) //eslint-disable-line no-alert, no-undef
	if (!response) return
	deleteFn(draftId)
}

const ModuleOptionsDialog = props => (
	<div className="module-permissions-dialog">
		<div className="top-bar">
			<ModuleIamge id={props.draftId} />
			<div className="module-title">{props.title}</div>
			<Button className="close-button" ariaLabel="Close" onClick={props.onClose}>
				×
			</Button>
		</div>
		<div className="wrapper">
			<h1 className="title">Module Options</h1>
			<div className="buttons-with-labels">
				<ButtonLink url={`/preview/${props.draftId}`} target="_blank">
					Preview
				</ButtonLink>
				<div className="label">View with preview controls.</div>

				<ButtonLink url={urlForEditor(props.editor, props.draftId)} target="_blank">
					Edit
				</ButtonLink>
				<div className="label">Write, edit, and update.</div>

				<Button
					className="new-button"
					onClick={() => {
						props.showModulePermissions(props)
					}}
				>
					Share
				</Button>
				<div className="label">Add or remove collaborators.</div>

				<Button
					className="new-button"
					onClick={() => {
						downloadDocument(props.draftId, 'json')
					}}
				>
					Download JSON
				</Button>
				<div className="label">Download a copy in JSON format.</div>

				<Button
					className="new-button"
					onClick={() => {
						downloadDocument(props.draftId, 'xml')
					}}
				>
					Download XML
				</Button>
				<div className="label">Download a copy in XML format.</div>

				<ButtonLink url={`/library/${props.draftId}`} target="_blank">
					Public Page
				</ButtonLink>
				<div className="label">Visit this modules public page.</div>

				<Button
					className="new-button dangerous-button"
					onClick={() => {
						deleteModule(props.title, props.draftId, props.deleteModule)
					}}
				>
					Delete
				</Button>
				<div className="label">Say farewell.</div>
			</div>
			<Button className="done-button secondary-button" onClick={props.onClose}>
				Close
			</Button>
		</div>
	</div>
)

module.exports = ModuleOptionsDialog
