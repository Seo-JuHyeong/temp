import { useEffect, useState } from "react"; 
import { Link } from "react-router-dom";
import { PlayDomain } from "./common";
import { useRef } from "react"; 

export default function PlayList() {
  const titleStyle = {
    fontSize: '3rem', // Increased the font size to 3 times the default size
    textDecoration: 'none', // Removing underline

  };
  
    const [playlist, setPlaylist] = useState([]); 
    const titleRef = useRef(null) ; 
    const authorRef= useRef(null) ;
    const genreRef= useRef(null) ;

    useEffect( init, []) ;  // 처음 한번만 실행 됨    
    
    function init(){
      fetch(`/api/${PlayDomain}`) 
      .then( res => { return res.json() }) 
      .then( data => { setPlaylist( data ) }) 
      .catch((error) => {
        console.error(error);
      });
    }
    function insertPlay() {
  const newPlay = {
    title: titleRef.current.value,
    author: authorRef.current.value,
    genre: genreRef.current.value,
  };
  
  fetch(`/api/${PlayDomain}`, {
    method: "POST", 
    headers: {
      'Content-Type': "application/json",
    },
    body: JSON.stringify(newPlay),
  })
    .then(res => {
      if (res.ok) {
        return res.json(); // JSON으로 파싱된 응답을 반환
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then(data => {
      alert("저장 성공");
      init();
    })
    .catch(error => {
      console.error(error);
    });
}

    return (
        <div> 
            <table>
						<caption className="title"><Link to='/' style={titleStyle}> 전체 플레이리스트 </Link></caption>
						<tbody>
            <tr>
                 <th>제목</th><th>가수</th><th>장르</th>
              </tr>
            { 
                playlist.map( (play) => (
                    <tr key = {play.id}> 
                      <td> <Link to={"/playlist/"+(play.id)}>{play.title}</Link></td>
                      <td>{play.author}</td>
                      <td>{play.genre}</td>
                    </tr>
                  )
                )
            }
            </tbody></table>
            <br/><br/> 
            <table>
              <br/>
              <h1>  추가할 플레이리스트를 입력하세요.</h1>
              <tr>
                 <th>제목</th><th>가수</th><th>장르</th>
              </tr>
              <tr>
                  <td><input type="text"  ref={titleRef} /></td>
                  <td><input type="text"  ref={authorRef} /></td>
                  <td><input type="text"  ref={genreRef} /></td>
              </tr> 
            </table>
            <br/>
            <button onClick={insertPlay}>저장버튼</button> 
        </div>
     );
 }

