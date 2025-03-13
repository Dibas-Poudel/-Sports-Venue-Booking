import supabase from "../services/supabaseClient";

const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching User profile:", error.message);
    return null;
  }

  return data;
};

export default fetchUserProfile;
