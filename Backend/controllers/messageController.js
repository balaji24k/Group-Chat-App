
exports.postMessage = async(req,res,next) =>{
	try {
		const result = await req.user.createMessage(req.body);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({message:"Something Went Wrong!"});
	}
};