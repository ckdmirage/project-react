import { useParams } from 'react-router-dom';
import MyPage from '../components/UserPage/MyPage';
import OtherUserPage from '../components/UserPage/OtherUserPage';

const UserPage = () => {
  const { id } = useParams();
  const userCert = JSON.parse(sessionStorage.getItem("userCert") || "null");
  const isSelf = userCert?.userId === Number(id);

  return isSelf ? <MyPage userId={id} /> : <OtherUserPage userId={id} />;
};

export default UserPage;