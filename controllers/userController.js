//GET /api/user
export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchCities = req.user.recentSearchCities || [];
    res.json({ success: true, role, recentSearchCities });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


//STORE USER RECENT SEARCHED CITIES
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const {recentSearchCity} = req.body;
        const user = req.user;

        if(user.recentSearchCities.length < 3){
            user.recentSearchCities.push(recentSearchCity)
        }else{
            user.recentSearchCities.shift();
            user.recentSearchCities.push(recentSearchCity)
        }
        await user.save()
        res.json({success:true, message: "City Added"})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}
