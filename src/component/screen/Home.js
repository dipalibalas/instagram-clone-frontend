import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
const API_URL = process.env.REACT_APP_URL;

const Home = () => {
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [profile, setProfile] = useState("");
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setProfile(user.pic);
    let unmounted = false;
    fetch(`${API_URL}/allpost`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (!unmounted) setData(result.posts);
      });
    return () => {
      unmounted = true;
    };
  }, []);

  const likePost = (id) => {
    fetch(`${API_URL}/like`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const unlikePost = (id) => {
    fetch(`${API_URL}/unlike`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (postId) => {
    fetch(`${API_URL}/comment`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text: comment,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setComment("");

        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });

        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const deletePost = (postid) => {
    fetch(`${API_URL}/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data &&
        data.map((item) => {
          return (
            <div className="card home-card" key={item._id}>
              <h5
                style={{
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Link
                  to={
                    item.postedBy._id !== state._id
                      ? "/profile/" + item.postedBy._id
                      : "/profile"
                  }
                  style={{
                    display: "flex",
                    paddingRight: "2px",
                    // width: "50%",
                  }}
                >
                  <img
                    src={
                      item.postedBy._id == state._id
                        ? profile
                        : "https://res.cloudinary.com/dtubo8vjd/image/upload/v1626606205/deflt_user_img_l9fxsp.png"
                    }
                    alt="user pic"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "80px",
                    }}
                  />
                  {item.postedBy.name}
                </Link>

                {item.postedBy._id === state._id && (
                  <i
                    className="material-icons"
                    style={{
                      float: "right",
                    }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
              </h5>

              <div className="card-image">
                <img src={item.photo} />
              </div>
              <div className="card-content">
                <i className="material-icons" style={{ color: "red" }}>
                  favorite
                </i>
                {item.likes.includes(state._id) ? (
                  <i
                    className="material-icons"
                    onClick={() => unlikePost(item._id)}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    onClick={() => likePost(item._id)}
                  >
                    thumb_up
                  </i>
                )}
                <h6>{item.likes.length} likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {item.comments.map((record) => {
                  return (
                    <h6 key={record._id}>
                      <span style={{ fontWeight: "500" }}>
                        {record.postedBy.name}{" "}
                      </span>
                      {record.text}
                    </h6>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(item._id);
                  }}
                >
                  <input
                    type="text"
                    placeholder="add comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </form>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Home;
