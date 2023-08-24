import { useEffect, useState } from "react"; 
import { Link } from "react-router-dom";
import { BoardDomain } from "./common";
import { useRef } from "react"; 

export default function BoardList() {
  const titleStyle = {
    fontSize: '3rem', // Increased the font size to 3 times the default size
    textDecoration: 'none', // Removing underline

  };
  
    const [boards, setBoards] = useState([]); 
    const titleRef = useRef(null);
    const writerRef = useRef(null); 
    const contentRef = useRef(null); 

    useEffect(init, []) ;  // 처음 한번만 실행 됨    
    
    function init(){
      fetch(`/api/${BoardDomain}`)
      .then( res => { return res.json() } ) 
      .then( data => { setBoards( data ) } 
      ).catch((error) => {
        console.error(error);
      });
    }

    function insertBoard(){
      let newBoard = {
          title: titleRef.current.value,
          writer: writerRef.current.value,
          content: contentRef.current.value,
      }
      fetch(`/api/${BoardDomain}`,
      { 
              method : "Post" ,     
              headers : {
                'Content-Type' : "application/json",
              },
              body : JSON.stringify( newBoard ) 
      }).then( res => {  
          if (res.ok ){
              alert(  "저장 성공 "); 
              init();
          }else{
            alert("저장 실패. id 값이 유일한지 확인하세요")
        }
      }).catch((error) => {
        console.error(error);
      });
    }
    return (
        <div> 
            <table>
                  <caption className="title"><Link to='/' style={titleStyle}> 전체 게시판 </Link></caption>
                  <tbody>
            <tr>
                 <th>번호</th><th>제목</th><th>내용</th><th>작성자</th>
              </tr>
            { 
                boards.map( (board ) => (
                    <tr key = {board.id}> 
                      <td>{board.id}</td>
                      <td> <Link to={"/board/"+(board.id)}>{board.title}</Link></td>
                      <td> <Link to={"/board/"+(board.id)}>{board.content}</Link></td>
                      <td>{board.writer}</td>
                    </tr>
                  )
                )
            }
            </tbody></table>
            <br/><br/> 
            <table>
              <br/>
              <h4> 새로 추가할 게시판 정보를 입력하세요.</h4>
              <tr>
                 <th>제목</th><th>내용</th><th>작성자</th>
              </tr>
              <tr>
                  <td><input type="text"  ref={titleRef} /></td>  
                  <td><input type="text"  ref={contentRef} /></td>  
                  <td><input type="text"  ref={writerRef} /></td>  
              </tr> 
            </table>
            <br/>
            <button onClick={insertBoard}>저장버튼</button> 
        </div>
     );
 }
