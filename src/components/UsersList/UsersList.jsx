import { Trash2 } from "lucide-react";

const UsersList = ({ users, onDeleteUser }) => {
  if (!users?.length) return <div className="text-white text-center mt-8">No users found.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Users</h2>
      <div className="space-y-2 text-white">
        {users.map((user) => (
          <div key={user.uid} className="bg-gray-800 rounded p-3 relative">
            <p>
              <strong>UID:</strong> {user.uid}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "No Email"}
            </p>
            <p>
              <strong>Account Verified:</strong> {user.emailVerified ? "Yes" : "No"}
            </p>
            <button
              onClick={() => onDeleteUser(user.uid)}
              className="absolute top-2 right-2 px-2 py-1 rounded text-red-400 hover:text-red-600"
              aria-label="Delete user"
            >
              <Trash2 size={32} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;
