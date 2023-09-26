const Message = require('../models/Message');
const { Op } = require('sequelize');

exports.postMessage = async(req,res,next) =>{
	try {
		const result = await req.user.createMessage(req.body);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({message:"Something Went Wrong!"});
	}
};

exports.getMessages = async(req,res,next) =>{
	try {
		const targetId = req.params.id;
		console.log("tagetId>>>>>>>",targetId);
		const result = await Message.findAll({
			where: {id : {[Op.gt]: targetId}},
			order: [['id', 'DESC']]
		});
		console.log("getExpenses>>>>>>>>>",result);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({message:"Something Went Wrong!"});
	}
};