import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from 'react-router-dom'
import { getCurrentUserData, GET_CURRENT_USER_DATA } from "../api/userAPI";
import { userProp } from "../components/interfaces/userProps";
import LoadingWIndow from "../components/load/LoadingWIndow";
import { getUserData, setUserStatus } from "../features/authSlice";
import { selectToken, setAuthToken } from "../features/tokenSlice";
import { auth } from "../firebase";
import HomePage from "../pages/Home/HomePage";
import Login from "../pages/login/Login";
// import Register from "../pages/login/register/Register";
import ProfiePage from "../pages/profile/ProfiePage";

const SearchRoutes: React.FC = () => {
  const user = useSelector(getUserData)
  const dispatch = useDispatch()
  // @ts-ignore
  const [currentUser, loading] = useAuthState(auth)
  const token = useSelector(selectToken)
  const [authToken, setToken] = useState("")
  // const [primaryLoad, setPrimaryLoad] = useState(true)


  const getUserDtails = async (userEmail: string) => {
    try {
      // const res = await getCurrentUserData(userEmail)
      const res = await GET_CURRENT_USER_DATA(userEmail, authToken)
      // console.log(res.data)
      updateUser(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const updateUser = async (userData: userProp) => {
    dispatch(setUserStatus({
      user: userData,
      isFetching: false,
      error: { message: "" },
    }))
    // console.log(user)
    // setPrimaryLoad(false)
  }

  const tokenSetter = async (currentUser: any) => {
    await currentUser.getIdToken(true)
      .then((token: string) => {
        dispatch(setAuthToken({
          token: token
        }))
        setToken(token)
      })
  }

  useEffect(() => {
    if (loading) return
    // setPrimaryLoad(true)
    if (currentUser?.email) {
      tokenSetter(currentUser)
      authToken &&
        getUserDtails(currentUser.email)
    }
    // eslint-disable-next-line
  }, [currentUser, loading, authToken])


  return <>
    {!loading ?
      <Routes>
        <Route path="/" element={!user.user && !currentUser ? <Navigate replace to="/login" /> : <HomePage />} />
        {!user.user && !currentUser &&
          <Route path="/login" element={<Login />} />
        }
        {currentUser && user.user && <Route path="/profile/:useremail" element={<ProfiePage />} />}
        {/* {currentUser && user.user && <Route path="/:searchQuery" element={<ProfiePage />} />} */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      :
      <LoadingWIndow />
    }
  </>;
};

export default SearchRoutes;
