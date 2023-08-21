import { useEffect, useState } from 'react'
import './App.css'

import axios from "axios";

function App() {
  interface User {
    id: number,
    name: string
  }

  //取得したユーザー用
  const [users, setUsers] = useState<User[]>([]);
  //作成するユーザー用
  const [name, setName] = useState<string>("");
  //ローディング用
  const [loading, setLoading] = useState<boolean>(false);


  // ユーザーを全て取得する
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);

      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        console.log(response);
        setUsers(response.data); // データを状態にセット
      } catch (error) {
        console.log("取得に失敗しました")
      }

      setLoading(false);

    }
    getUsers();
  }, [])


  // フォームに入力された値を取得する
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  // ユーザーを作成追加する
  const addUser = async () => {
    try {
      const response = await axios.post(`https://jsonplaceholder.typicode.com/users`,{name:name});
      console.log(response.data);
      setUsers([response.data, ...users])
      console.log(users)
    } catch (error) {
      console.log('データの送信に失敗しました');
    }
    setName("");
  }

  // ユーザー削除
  const deleteUser = async (id:number) => {
    // console.log(id);
    try {
      const response = await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      console.log(response);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.log('削除に失敗しました');
    }
  }

  //ユーザー更新
  const updateUser = async (id:number) => {
    try {
      const response = await axios.patch(`https://jsonplaceholder.typicode.com/users/${id}`,
        {
          name: "shohei"
        }
      )
      const updateUsers = users.map((user) => {
        if(user.id === response.data.id){
          return response.data
        }else{
          return user;
        }
      })
      setUsers(updateUsers)
    } catch (error) {
      console.log("更新に失敗しました");
    }
  }


  return (
    <>
      <div className='App'>
        <input type="text" value={name} onChange={handleChange} />
        <button onClick={addUser}>作成</button>
        <h1>ユーザーリスト</h1>
        <ul>
          {/* loadingがtrueであれば”Loadingを表示し、falseならば”map関数で取得した値を表示する */}
          {loading
            ? "loading...."
            :users.map((user,index) => (
              <li key={index}>{user.id}:{user.name}:<button onClick={() => deleteUser(user.id)}>削除</button><button onClick={() => updateUser(user.id)}>更新</button></li>
            ))
          }
        </ul>
      </div>

    </>
  )
}

export default App
