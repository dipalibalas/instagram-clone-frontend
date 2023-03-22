import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
const API_URL = process.env.REACT_APP_URL;
const Profile = () => {
  const [myPics, setMyPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  //console.log(state)

  useEffect(() => {
    let unmounted = false;
    fetch(`${API_URL}/mypost`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        if (!unmounted) setMyPics(result.mypost);
        //console.log(myPics)
      });

    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    if (image) {
      // const data = new FormData();
      // data.append("file", image);
      // data.append("upload_preset", "instagram-clone");
      // data.append("cloud_name", "dtubo8vjd");

      // // request to cloudinary
      // fetch("https://api.cloudinary.com/v1_1/dtubo8vjd/image/upload", {
      //   method: "post",
      //   body: data,
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      console.log("image ", image);
      fetch("/updatepic", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          // pic: data.url,
          pic: image,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log("result:" + JSON.stringify(result));
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, pic: result.pic })
          );
          dispatch({ type: "UPDATEPIC", payload: result.pic });
          //window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
      // })
      // .catch((err) => {
      //   console.log(err);
      // });
    }
  }, [image]);

  const updatePhoto = (file) => {
    // setImage(file);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "instagram-clone");
    data.append("cloud_name", "dtubo8vjd");

    // request to cloudinary
    fetch("https://api.cloudinary.com/v1_1/dtubo8vjd/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setImage(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      style={{
        maxWidth: "550px",
        margin: "0px auto",
      }}
    >
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              src={state ? state.pic : "loading..."}
              alt="user image"
            />
          </div>

          <div>
            <h4>{state ? state.name : "loading.."}</h4>
            <h5>{state ? state.email : "loading.."}</h5>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h6>{myPics.length} Posts</h6>
              <h6>{state ? state.followers.length : "0"} followers</h6>
              <h6>{state ? state.following.length : "0"} following</h6>
            </div>
          </div>
        </div>

        <div className="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn #64b5f6 blue darken-1">
            <span>Update pic</span>
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>

      <div className="gallery">
        {myPics.map((item) => {
          return (
            <img
              key={item._id}
              src={item.photo}
              alt={item.title}
              className="image-item"
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
