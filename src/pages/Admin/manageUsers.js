export const fetchUsers = async () => {
  try {
    const res = await fetch("https://api-hv554ierzq-uc.a.run.app/getUsers");
    const users = await res.json();
    return users;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};
