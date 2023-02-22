import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../features/api/usersApi";

export default function Logout() {
  let navigate = useNavigate();
  const [logoutUser2] = useLogoutMutation();
  // @ts-ignore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await logoutUser2("");
    return navigate("/login");
  };
  return (
    <div className="text-center pb-20 text-lg">
      <form onSubmit={handleSubmit}>
        <button>Logout</button>
      </form>
    </div>
  );
}
