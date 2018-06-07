const processJsonResults = res => {
	return Promise.resolve(res.json()).then(json => {
		if (json.status === 'error') console.log(json.value)
		return json
	})
}

var APIUtil = {
	get(endpoint) {
		return fetch(endpoint, {
			method: 'GET',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			} //@TODO - Do I need this?
		})
	},

	post(endpoint, body) {
		if (body == null) {
			body = {}
		}
		return fetch(endpoint, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(body),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
	},

	postEvent(lo, action, eventVersion, payload) {
		return (
			APIUtil.post('/api/events', {
				event: {
					action,
					draft_id: lo.get('draftId'),
					actor_time: new Date().toISOString(),
					event_version: eventVersion,
					payload
				}
			})
				.then(processJsonResults)
				// TODO: Send Caliper event to client host.
				.then(res => {
					if (res && res.status === 'ok' && res.value) {
						parent.postMessage(res.value, '*')
					}

					return res
				})
		)
	},

	saveState(lo, state) {
		return APIUtil.postEvent(lo, 'saveState', state)
	},

	getDraft(id) {
		return fetch(`/api/drafts/${id}`).then(processJsonResults)
	},

	requestStart(visitId, draftId) {
		return APIUtil.post('/api/visits/start', {
			visitId,
			draftId
		}).then(processJsonResults)
	},

	startAttempt({ lo, assessment, visitId }) {
		return APIUtil.post('/api/assessments/attempt/start', {
			draftId: lo.get('draftId'),
			assessmentId: assessment.get('id'),
			visitId
		}).then(processJsonResults)
	},

	endAttempt({ attempt, visitId }) {
		return APIUtil.post(`/api/assessments/attempt/${attempt.attemptId}/end`, { visitId }).then(
			processJsonResults
		)
	},

	resendLTIAssessmentScore({ lo, assessment, visitId }) {
		return APIUtil.post('/api/lti/sendAssessmentScore', {
			draftId: lo.get('draftId'),
			assessmentId: assessment.get('id'),
			visitId
		}).then(processJsonResults)
	},

	clearPreviewScores({ draftId, visitId }) {
		return APIUtil.post('/api/assessments/clear-preview-scores', { draftId, visitId }).then(
			processJsonResults
		)
	}
}

export default APIUtil
