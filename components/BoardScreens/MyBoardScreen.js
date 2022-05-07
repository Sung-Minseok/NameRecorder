import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  TextInput,
  Platform,
  FlatList,
} from "react-native";

import { auth, db } from "../../Firebase";

import { getStatusBarHeight } from "react-native-status-bar-height";
import { useSelector } from "react-redux";
import { collection, orderBy, query, where } from "firebase/firestore";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";

const Item = ({ item }) => (
  <View style={{borderBottomWidth:1, height:40, flexDirection: 'row', justifyContent: 'center',alignItems: 'center'}}>
          <View style={{borderRightWidth:1, flex:0.75, justifyContent:'center', alignItems:'center', height:40}}>
            <Text style={{fontSize: 18, fontWeight:'500'}}>{'번호'}</Text>
          </View>
          <View style={{borderRightWidth:1, flex:3, justifyContent:'center', alignItems:'center', height:40}}>
            <Text style={{fontSize: 18, fontWeight:'500'}}>{item.title}</Text>
          </View>
          <View style={{borderRightWidth:1, flex:1, justifyContent:'center', alignItems:'center', height:40}}>
            <Text style={{fontSize: 18, fontWeight:'500'}}>{item.date}</Text>
          </View>
          <View style={{flex:1, justifyContent:'center', alignItems:'center', height:40}}>
            <Text style={{fontSize: 18, fontWeight:'500', color: item.check===false ? 'black':'blue'}}>{item.check===false ? '대기중' : '답변완료'}</Text>
          </View>
        </View>
);

export default function MyBoardScreen(props) {
  const OS = Platform.OS;
  const reduxState = useSelector((state) => state);
  const [boardList, setBoardList] = useState([]);
  useEffect(() => {
    // console.log(props)
    getInfo();
  }, []);

  const renderItem = ({ item }) => <Item item={item} />;

  const getInfo = async () => {
    const uid = auth.getAuth().currentUser.uid;
    const boardRef = collection(db.getFirestore(), "board");
    const q = query(boardRef, where("uid", "==", uid), orderBy("date", "desc"));
    const querySnapshot = await db.getDocs(q);
    let list = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      list.push(doc.data())
    });
    setBoardList(list);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        backgroundColor: "white",
        paddingTop: 15,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          paddingVertical: 10,
          width: DEVICE_WIDTH*0.95
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "600", flex:1}}>문의글 목록</Text>
        <TouchableOpacity onPress={()=>{
          getInfo();
        }}>
          <Text>새로고침</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderWidth: 2,
          borderColor: "black",
          width: DEVICE_WIDTH * 0.95,
          // height: 500,
          flexDirection: "column",
          flex: 1,
        }}
      >
        <View style={{borderBottomWidth:2 ,height:40, flexDirection: 'row', justifyContent: 'center',alignItems: 'center'}}>
          <View style={{borderRightWidth:2, flex:0.75, justifyContent:'center', alignItems:'center', height:40}}>
            <Text style={{fontSize: 18, fontWeight:'bold'}}>번호</Text>
          </View>
          <View style={{borderRightWidth:2, flex:3, justifyContent:'center', alignItems:'center', height:40}}>
            <Text style={{fontSize: 18, fontWeight:'bold'}}>제목</Text>
          </View>
          <View style={{borderRightWidth:2, flex:1, justifyContent:'center', alignItems:'center', height:40}}>
            <Text style={{fontSize: 18, fontWeight:'bold'}}>작성일</Text>
          </View>
          <View style={{flex:1, justifyContent:'center', alignItems:'center', height:40}}>
            <Text style={{fontSize: 18, fontWeight:'bold'}}>답변</Text>
          </View>
        </View>
        <FlatList
          data={boardList}
          keyExtractor={(item) => item.title}
          renderItem={renderItem}
          extraData={boardList}
        />
      </View>
    </View>
  );
}

const DATA = [
  {
    id: "1",
    title: "First Item",
  },
  {
    id: "2",
    title: "Second Item",
  },
  {
    id: "3",
    title: "Third Item",
  },
  {
    id: "4",
    title: "Forth Item",
  },
  {
    id: "5",
    title: "Fifth Item",
  },
  {
    id: "6",
    title: "Sixth Item",
  },
  {
    id: "7",
    title: "Seventh Item",
  },
  {
    id: "8",
    title: "Eighth Item",
  },
  {
    id: "9",
    title: "Ninth Item",
  },
  {
    id: "10",
    title: "Tenth Item",
  },
];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
