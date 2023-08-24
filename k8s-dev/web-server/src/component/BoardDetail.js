import { useEffect, useState } from "react";  
import { useParams, Link } from "react-router-dom";
import { BoardDomain} from "./common";
import { useNavigate } from "react-router-dom";
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

export default function BoardDetail() {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newWriter, setNewWriter] = useState("");
  const [newContent, setNewContent] = useState("");
  
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

  const [board, setBoard] = useState({
    "id": 0,
    "title": null,
    "content": null,
    "writer": null
  });

  const {id} = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/${BoardDomain}/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch board data.');
        }
        return res.json();
      })
      .then((data) => {
        setBoard(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  function updateBoard() {
    board.title = newTitle;
    board.content = newContent;
    board.writer = newWriter;
    let newBoard = { ...board };
      
    fetch(`/api/${BoardDomain}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBoard),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('게시판을 수정하는데 실패했습니다.');
      }
      closeModal();
      setBoard(newBoard); //state 변경으로 화면 갱신
    })
    .catch((error) => {
      console.error(error);
    });
  }

  function deleteBoard() {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      fetch(`/api/${BoardDomain}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        navigate('/board');
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
          <Link to='/board' style={titleStyle}> 상세 게시판 </Link>
        </caption>
        <tbody>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>내용</th>
            <th>작성자</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
          <tr key={board.id}> 
            <td>{board.id}</td>
            <td>{board.title}</td>
            <td>{board.content}</td>
            <td>{board.writer}</td>
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
                    {'작성자:  '}
                    <input className="input-field" type="text" value={newWriter} onChange={(e) => setNewWriter(e.target.value)} />
                  </label>
                  <label className="input-label">
                    {'내용: '} 
                    <input className="input-field" type="text" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
                  </label>
                </div>
                <div className="button-container">
                  <button onClick={updateBoard}>완료</button>
                  <button onClick={closeModal}>취소</button>
                </div>
              </Modal>
            </td> 
            <td><button onClick={deleteBoard}>Delete</button></td>
          </tr> 
        </tbody>
      </table>
    </div>
  );
}

