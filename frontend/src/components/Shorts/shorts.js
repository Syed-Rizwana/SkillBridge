// import React, { useState, useEffect } from 'react';
// import { faThumbsUp, faThumbsDown, faComment, faUserCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
// import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
// import './AShorts.css';

// const AShorts = () => {
//     const [videoData, setVideoData] = useState([]);
//     const [reactions, setReactions] = useState([]);
//     const [descriptionVisible, setDescriptionVisible] = useState([]);
//     const [commentVisible, setCommentVisible] = useState([]);
//     const [comments, setComments] = useState({});
//     const [isNavActive, setIsNavActive] = useState(false);
//     const location = useLocation();
//     const { data } = location.state || {};
//     useEffect(() => {
//         const fetchVideoData = () => {
//             const videos = ['video1.mp4', 'video2.mp4']; // Replace with your video data
//             setVideoData(videos);
//             setReactions(videos.map(() => ({ liked: false, disliked: false })));
//             setDescriptionVisible(videos.map(() => false));
//             setCommentVisible(videos.map(() => false));

//             const storedComments = {};
//             videos.forEach(video => {
//                 const videoComments = JSON.parse(localStorage.getItem(`comments-${video}`)) || [];
//                 storedComments[video] = videoComments;
//             });
//             setComments(storedComments);
//         };

//         fetchVideoData();
//     }, []);

//     const handleReaction = (index, reactionType) => {
//         setReactions((prevReactions) => {
//             const newReactions = [...prevReactions];
//             if (!newReactions[index][reactionType]) {
//                 newReactions[index][reactionType] = true;
//                 newReactions[index][reactionType === 'liked' ? 'disliked' : 'liked'] = false;
//             }
//             return newReactions;
//         });
//     };

//     const toggleDescription = (index) => {
//         setDescriptionVisible((prevVisibility) => {
//             const newVisibility = [...prevVisibility];
//             newVisibility[index] = !newVisibility[index];
//             return newVisibility;
//         });
//     };

//     const toggleComment = (index) => {
//         setCommentVisible((prevVisibility) => {
//             const newVisibility = [...prevVisibility];
//             newVisibility[index] = !newVisibility[index];
//             return newVisibility;
//         });
//     };

//     const handleCommentSubmit = (index, videoId) => {
//         const commentInput = document.querySelector(`#comment-input-${index}`);
//         const commentText = commentInput.value;

//         if (commentText.trim()) {
//             const newComments = { ...comments };
//             if (!newComments[videoId]) {
//                 newComments[videoId] = [];
//             }
//             newComments[videoId].push(commentText);

//             localStorage.setItem(`comments-${videoId}`, JSON.stringify(newComments[videoId]));

//             setComments(newComments);
//             commentInput.value = '';
//         }
//     };

//     const toggleNav = () => {
//         setIsNavActive(!isNavActive);
//     };

//     return (
//         <div className="home">
//             <nav className="navbar">
//                 <div className="logo">
//                     <h1 style={{ fontFamily: "Courier New', Courier, monospace", fontSize: '27px' }}>
//                         SkillBridge
//                     </h1>
//                 </div>
//                 <div className="nav-right">
//                     <ul className={`nav-links ${isNavActive ? 'active' : ''}`} id="navLinks">
//                     <li><Link to="/AHome" state={{ data: data }}>Home</Link></li>
//                     <li><Link to="/myworks" state={{ data: data }}>My Works</Link></li>
//                         <li><Link to="/Ashorts" state={{ data: data }}>Shorts</Link></li>
//                         <li><Link to="/Aservices" state={{ data: data }}>Services</Link></li>
//                         <li>
//                             <Link to="/notifications" state={{ data: data }} className="notification-link">
//                                 <FontAwesomeIcon icon={faBell} />
//                             </Link>
//                         </li>
//                     </ul>
//                     <div className="profile">
//                         <img
//                             src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
//                             alt="Profile"
//                             className="profile-img"
//                         />
//                     </div>
//                     <div className="hamburger" id="hamburger" onClick={toggleNav}>
//                         <span className="bar"></span>
//                         <span className="bar"></span>
//                         <span className="bar"></span>
//                     </div>
//                 </div>
//             </nav>
//             <div className="videos-container">
//                 {videoData.map((videoFileName, index) => (
//                     <div key={index} className="video-card">
//                         <div className="single-video">
//                             <video
//                                 key={index}
//                                 controls
//                                 src={`http://localhost:5000/uploads/${videoFileName}`}
//                                 style={{ width: '400px', margin: '10px', height: 'auto' }}
//                             >
//                                 Your browser does not support the video tag.
//                             </video>
//                         </div>

//                         <div className="interaction">
//                             <button>
//                                 <FontAwesomeIcon icon={faUserCircle} />
//                             </button>
//                             <button
//                                 onClick={() => handleReaction(index, 'liked')}
//                                 disabled={reactions[index]?.liked}
//                             >
//                                 <FontAwesomeIcon icon={faThumbsUp} />
//                                 <p className="ptag">{reactions[index]?.liked ? 1 : 0}</p>
//                             </button>
//                             <button
//                                 onClick={() => handleReaction(index, 'disliked')}
//                                 disabled={reactions[index]?.disliked}
//                             >
//                                 <FontAwesomeIcon icon={faThumbsDown} />
//                                 <p className="ptag">{reactions[index]?.disliked ? 1 : 0}</p>
//                             </button>
//                             <button onClick={() => toggleComment(index)}>
//                                 <FontAwesomeIcon icon={faComment} />
//                             </button>
//                         </div>

//                         {descriptionVisible[index] && <p className="video-description">Video description here</p>}

//                         {commentVisible[index] && (
//                             <div className="comment-section">
//                                 <div className="comment-input-container">
//                                     <textarea
//                                         id={`comment-input-${index}`}
//                                         placeholder="Write a comment..."
//                                         className="comment-input"
//                                     ></textarea>
//                                     <button
//                                         className="submit-comment"
//                                         onClick={() => handleCommentSubmit(index, videoFileName)}
//                                     >
//                                         <FontAwesomeIcon icon={faPaperPlane} />
//                                     </button>
//                                 </div>
//                                 <div className="comments-list">
//                                     {comments[videoFileName]?.map((comment, idx) => (
//                                         <p key={idx}>{comment}</p>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AShorts;

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API calls
import './shorts.css'; // Assuming you already have the styles
import { Link, useLocation } from 'react-router-dom';

const Shorts = () => {
    const [isNavActive, setIsNavActive] = useState(false);
    const [videoData, setVideoData] = useState([]);
    const [reactions, setReactions] = useState([]);
    const [descriptionVisible, setDescriptionVisible] = useState([]);
    const [commentVisible, setCommentVisible] = useState([]);
    const [comments, setComments] = useState({});
    const location = useLocation();
    const { data } = location.state || {};
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/demovideos'); // Fetch demo videos from backend
                const videos = response.data.map(item => item.demoVideos).flat(); // Flatten the array of demoVideos
                setVideoData(videos);
                setReactions(videos.map(() => ({ liked: false, disliked: false })));
                setDescriptionVisible(videos.map(() => false));
                setCommentVisible(videos.map(() => false));

                const storedComments = {};
                videos.forEach(video => {
                    const videoComments = JSON.parse(localStorage.getItem(`comments-${video}`)) || [];
                    storedComments[video] = videoComments;
                });
                setComments(storedComments);
            } catch (error) {
                console.error('Error fetching video data', error);
            }
        };

        fetchVideoData();
    }, []);
    const toggleNav = () => {
        setIsNavActive(!isNavActive);
    };
    const handleReaction = (index, reactionType) => {
        setReactions(prevReactions => {
            const newReactions = [...prevReactions];
            if (!newReactions[index][reactionType]) {
                newReactions[index][reactionType] = true;
                newReactions[index][reactionType === 'liked' ? 'disliked' : 'liked'] = false;
            }
            return newReactions;
        });
    };

    const toggleDescription = (index) => {
        setDescriptionVisible(prevVisibility => {
            const newVisibility = [...prevVisibility];
            newVisibility[index] = !newVisibility[index];
            return newVisibility;
        });
    };

    const toggleComment = (index) => {
        setCommentVisible(prevVisibility => {
            const newVisibility = [...prevVisibility];
            newVisibility[index] = !newVisibility[index];
            return newVisibility;
        });
    };

    const handleCommentSubmit = (index, videoId) => {
        const commentInput = document.querySelector(`#comment-input-${index}`);
        const commentText = commentInput.value;

        if (commentText.trim()) {
            const newComments = { ...comments };
            if (!newComments[videoId]) {
                newComments[videoId] = [];
            }
            newComments[videoId].push(commentText);

            localStorage.setItem(`comments-${videoId}`, JSON.stringify(newComments[videoId]));

            setComments(newComments);
            commentInput.value = '';
        }
    };

    return (
        <div className="home">
            <nav className="navbar">
                <div className="logo">
                    <h1 style={{ fontFamily: "Courier New', Courier, monospace", fontSize: '27px' }}>
                        SkillBridge
                    </h1>
                </div>
                <div className="nav-right">
                    <ul className={`nav-links ${isNavActive ? 'active' : ''}`} id="navLinks">
                        <li><Link to="/Home">Home</Link></li>
                        <li><Link to="/shorts">Shorts</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        {/* <li><Link to="/booked-services">Booked Services</Link></li> */}
                        <li><Link to="/">LogOut</Link></li>

                    </ul>
                    <div className="profile">
                        <img
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            alt="Profile"
                            className="profile-img"
                        />
                    </div>
                    <div className="hamburger" id="hamburger" onClick={toggleNav}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </div>
            </nav>
            <div className="videos-container">
                {videoData.map((videoFileName, index) => (
                    <div key={index} className="video-card">
                        <div className="single-video">
                            <video
                                key={index}
                                controls
                                src={`http://localhost:5000/uploads/${videoFileName}`} // Assuming the videos are served from the uploads folder
                                style={{ width: '400px', margin: '10px', height: 'auto' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        <div className="interaction">
                            <button onClick={() => handleReaction(index, 'liked')}>
                                👍 {reactions[index]?.liked ? 1 : 0}
                            </button>
                            <button onClick={() => handleReaction(index, 'disliked')}>
                                👎 {reactions[index]?.disliked ? 1 : 0}
                            </button>
                            <button onClick={() => toggleComment(index)}>💬Comments</button>
                        </div>

                        {descriptionVisible[index] && <p className="video-description">Video description here</p>}

                        {commentVisible[index] && (
                            <div className="comment-section">
                                <textarea id={`comment-input-${index}`} placeholder="Write a comment..." />
                                <button onClick={() => handleCommentSubmit(index, videoFileName)}>Submit</button>
                                <div className="comments-list">
                                    {comments[videoFileName]?.map((comment, idx) => (
                                        <p key={idx}>{comment}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shorts;
