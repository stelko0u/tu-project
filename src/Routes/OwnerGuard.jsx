import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const OwnerGuard = ({ children }) => {
  const [isOwner, setIsOwner] = useState(null);
  const { id: carId } = useParams();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkOwnership = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const carDocRef = doc(db, "cars", carId);
          const carSnapshot = await getDoc(carDocRef);

          if (carSnapshot.exists()) {
            const carData = carSnapshot.data();

            if (carData.owner === user.email) {
              setIsOwner(true);
            } else {
              setIsOwner(false);
            }
          } else {
            console.log("No such car document!");
            setIsOwner(false);
          }
        } catch (error) {
          console.error("Error fetching car document:", error);
          setIsOwner(false);
        }
      } else {
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [auth, db, carId]);

  if (isOwner === null) {
    return null;
  }

  if (!isOwner) {
    return <Navigate to="/catalog" />;
  }

  return <>{children}</>;
};

export default OwnerGuard;
