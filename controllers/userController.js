//GET /api/user
export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchCities = req.user.recentSearchCities;
    res.json({ success: true, role, recentSearchCities });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


//STORE USER RECENT SEARCHED CITIES
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const {recentSearchedCity} = req.body;
        const user = await req.user;

        if(user.recentSearchCities.length < 3){
            user.recentSearchCities.push(recentSearchedCity)
        }else{
            user.recentSearchCities.shift();
            user.recentSearchCities.push(recentSearchedCity)
        }
        await user.save()
        res.json({success:true, message: "City Added"})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}
