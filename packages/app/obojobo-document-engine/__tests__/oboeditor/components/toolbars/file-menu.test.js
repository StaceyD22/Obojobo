import { shallow, mount } from 'enzyme'
import React from 'react'

import FileMenu from 'obojobo-document-engine/src/scripts/oboeditor/components/toolbars/file-menu'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import APIUtil from 'src/scripts/viewer/util/api-util'
jest.mock('src/scripts/viewer/util/api-util')
import ClipboardUtil from 'src/scripts/oboeditor/util/clipboard-util'
jest.mock('src/scripts/oboeditor/util/clipboard-util')
import EditorUtil from 'src/scripts/oboeditor/util/editor-util'
jest.mock('src/scripts/oboeditor/util/editor-util')
import EditorStore from 'src/scripts/oboeditor/stores/editor-store'
jest.mock('src/scripts/oboeditor/stores/editor-store', () => ({
	state: { startingId: null, itemsById: { mockStartingId: { label: 'theLabel' } } }
}))

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

describe('File Menu', () => {
	beforeEach(() => {
		EditorStore.state.startingId = null
		jest.clearAllMocks()
	})
	
	test('File Menu node', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})
		const component = shallow(<FileMenu draftId="mockDraft"/>)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileMenu calls save', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})

		const model = {
			flatJSON: () => ({ children: [] }),
			children: [
				{
					get: () => CONTENT_NODE,
					flatJSON: () => ({ children: [] }),
					children: { models: [
						{ get: () => 'mockValue' }
					]}
				},
				{
					get: () => ASSESSMENT_NODE,
				}
			]
		}

		const exportToJSON = jest.fn()

		const component = mount(
			<FileMenu draftId="mockDraft" model={model} exportToJSON={exportToJSON}/>
		)
		const tree = component.html()

		APIUtil.postDraft.mockResolvedValueOnce({
			status: 'ok'
		})

		component
			.find('button')
			.at(1)
			.simulate('click')

		APIUtil.postDraft.mockResolvedValueOnce({
			status: 'error',
			value: { message: 'mock Error'}
		})

		component
			.find('button')
			.at(1)
			.simulate('click')


		expect(tree).toMatchSnapshot()
		expect(APIUtil.postDraft).toHaveBeenCalledTimes(2)
	})

	test('FileMenu calls new', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})

		const component = mount(
			<FileMenu draftId="mockDraft" />
		)
		const tree = component.html()

		APIUtil.createNewDraft.mockResolvedValueOnce({
			status: 'ok'
		})

		component
			.find('button')
			.at(2)
			.simulate('click')

		APIUtil.createNewDraft.mockResolvedValueOnce({
			status: 'error',
			value: { message: 'mock Error'}
		})

		component
			.find('button')
			.at(2)
			.simulate('click')


		expect(tree).toMatchSnapshot()
		expect(APIUtil.createNewDraft).toHaveBeenCalledTimes(2)
	})

	test.only('FileMenu calls Open', done => {
		const model = {
			title: 'mockTitle'
		}

		const mockedCallback = () => Promise.resolve({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})
		let promise
		APIUtil.getAllDrafts.mockImplementationOnce(() => {
			promise = Promise.resolve().then(mockedCallback)
			return promise
		})

		const component = shallow(
			<FileMenu draftId="mockDraft" model={model}/>
		)

		promise.then(() => {
			component.update()
			const tree = component.html()
			console.log(tree)

			expect(tree).toMatchSnapshot()
			done()
		})
	})

	test('FileMenu calls Copy', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})

		const model = {
			title: 'mockTitle'
		}

		const component = mount(
			<FileMenu draftId="mockDraft" model={model}/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(4)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('FileMenu calls Rename', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})

		const model = {
			title: 'mockTitle'
		}

		const component = mount(
			<FileMenu draftId="mockDraft" model={model}/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(5)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('FileMenu calls Delete', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})

		const model = {
			title: 'mockTitle'
		}

		const component = mount(
			<FileMenu draftId="mockDraft" model={model}/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(6)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('FileMenu calls Copy LTI Link', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})

		const model = {
			title: 'mockTitle'
		}

		const component = mount(
			<FileMenu draftId="mockDraft" model={model}/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(7)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ClipboardUtil.copyToClipboard).toHaveBeenCalled()
	})

	test('renameModule renames with blank name', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})

		const component = mount(
			<FileMenu draftId="mockDraft"/>
		)

		component.instance().renameModule('mockId', '      ')

		expect(EditorUtil.renamePage).toHaveBeenCalled()
	})

	test('renameModule renames with new name', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})

		const component = mount(
			<FileMenu draftId="mockDraft"/>
		)

		component.instance().renameModule('mockId', 'mock title')

		expect(EditorUtil.renamePage).toHaveBeenCalled()
	})

	test('copyModule creates a copy of the current draft', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})

		const model = {
			flatJSON: () => ({ children: [] }),
			children: [
				{
					get: () => CONTENT_NODE,
					flatJSON: () => ({ children: [] }),
					children: { models: [
						{ get: () => 'mockValue' }
					]}
				},
				{
					get: () => ASSESSMENT_NODE,
				}
			]
		}

		const exportToJSON = jest.fn()

		const component = mount(
			<FileMenu draftId="mockDraft" model={model} exportToJSON={exportToJSON}/>
		)

		APIUtil.createNewDraft.mockResolvedValueOnce({
			value: { id: 'mockId' }
		})
		APIUtil.postDraft.mockResolvedValueOnce({
			status: 'ok'
		})

		component.instance().copyModule('mockId', 'mock title - copy')

		expect(APIUtil.createNewDraft).toHaveBeenCalled()
	})

	test('deleteModule removes draft', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({ value: [
			{ draftId: "mockDraft" },
			{ draftId: "otherDraft" }
		]})

		const component = mount(
			<FileMenu draftId="mockDraft"/>
		)

		APIUtil.deleteDraft.mockResolvedValueOnce({ status: 'ok' })
		component.instance().deleteModule('mockId', '      ')

		APIUtil.deleteDraft.mockResolvedValueOnce({ status: 'error' })
		component.instance().deleteModule('mockId', '      ')

		expect(APIUtil.deleteDraft).toHaveBeenCalled()
	})
})
