import Player from "../models/player.js";
// export const getUserData =async(req,res)=>{
//     const id = req.user.userId;
//     try{
// const player = await Player.findById(id).select("_id playerName tokens").lean();
// if(!player) {
//     return res.status(400).json({ message: "You have to login." });
// }
// player.tokens = player.tokens.toString();
// res.status(200).json({player});
//     }catch(err){
//  console.log(err);
//     res.status(500).json({
//       message: "something went wrong in finding UserData.",
//       err: err.message
//     });
//     }

// };


export const getLeaderboard = async (req, res) => {
  try {

    const topPlayers = await Player.find({})
      .select(
        "playerName tokens gamesAnalytics"
      )
      .sort({
        "gamesAnalytics.wins": -1
      })
      .limit(10).lean();

      topPlayers.forEach(player => {
  player.tokens = player.tokens.toString();
});

    res.status(200).json({
      success: true,
      players: topPlayers,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard, You have to login.",
      err: err.message,
    });
  }
};

