var express = require('express');
var router = express.Router();
var oboEvents = oboRequire('obo_events')
var insertEvent = oboRequire('insert_event')


let getCaliperEventFromClientEvent = (clientEvent) => {
	return ({
		'todo': 'create a caliper event'
	})
}

router.post('/', (req, res, next) => {
	return req.requireCurrentUser()
	.then(currentUser => {
		// check input

		// add data to the event
		let event = req.body.event

		let caliperEvent = getCaliperEventFromClientEvent(event)

		let insertObject = {
			actorTime: event.actor_time,
			action: event.action,
			userId: currentUser.id,
			ip: req.connection.remoteAddress,
			metadata: {},
			payload: event.payload,
			draftId: event.draft_id,
			caliperPayload: caliperEvent
		}

		return insertEvent(insertObject)
		.then(result => {
			insertObject.createdAt = result.created_at;
			oboEvents.emit(`client:${event.action}`, insertObject, req);
			res.success({ createdAt:result.created_at });
			return next();
		})
		.catch(err => {
			console.error('Insert Event Failure:', err)
			res.unexpected(err);
			next();
		})
	})
	.catch(err => {
		console.log(err)
		res.notAuthorized(err);
		next();
		return Promise.reject(err)
	})

})

module.exports = router;
