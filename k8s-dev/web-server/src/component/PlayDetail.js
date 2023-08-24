import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PlayDomain } from "./common";
import { useNavigate } from "react-router-dom";
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function PlayDetail() {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newGenre, setNewGenre] = useState("");

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const titleStyle = {
    fontSize: '3rem', // Increased the font size to 3 times the default size
    textDecoration: 'none', // Removing underline
  };

  const [play, setPlay] = useState({
    "id": 0,
    "name": null,
    "author": null,
    "genre": null
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/${PlayDomain}/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch playlist data.');
        }
        return res.json();
      })
      .then((data) => {
        setPlay(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  function updatePlay() {
    play.title = newTitle;
    play.author = newAuthor;
    play.genre = newGenre;
    let newPlay = { ...play };

    fetch(`/api/${PlayDomain}/${id}`, {
      method: "Put",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify(
        newPlay
      )
    })
      .then((res) => {
        if (res.ok) {
          closeModal();
          setPlay(newPlay); 
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function deletePlay() {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      fetch(`/api/${PlayDomain}/${id}`,
        {
          method: "Delete",
          headers: {
            'Content-Type': "application/json",
          },
        }
      )
        .then(() => {
          navigate('/playlist');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  return (
    <div>
      <table border={1}>
        <caption className="title">
          <Link to='/playlist' style={titleStyle}> 플레이리스트 정보 </Link>
        </caption>
        <tbody>
          <tr>
            <th>제목</th>
            <th>가수</th>
            <th>장르</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
          <tr key={play.id}>
            <td>{play.title}</td>
            <td>{play.author}</td>
            <td>{play.genre}</td>
            <td>
              <button onClick={openModal}>수정</button>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Update Board"
                className="modal"
                overlayClassName="overlay"
              >
                <h2>수정</h2>
                <div className="input-container">
                  <label className="input-label">
                    {'제목:  '}
                    <input className="input-field" type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                  </label>
                  <label className="input-label">
                    {'가수:  '}
                    <input className="input-field" type="text" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} />
                  </label>
                  <label className="input-label">
                    {'장르: '}
                    <input className="input-field" type="text" value={newGenre} onChange={(e) => setNewGenre(e.target.value)} />
                  </label>
                </div>
                <div className="button-container">
                  <button onClick={updatePlay}>완료</button>
                  <button onClick={closeModal}>취소</button>
                </div>
              </Modal>
            </td>
            <td><button onClick={deletePlay}>Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

