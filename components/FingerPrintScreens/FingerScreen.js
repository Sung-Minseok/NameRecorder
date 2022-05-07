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
import * as ImagePicker from "expo-image-picker"
import { auth, db, storage } from "../../Firebase";

import * as FileSystem from "expo-file-system";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Camera } from "expo-camera";
import { useSelector } from "react-redux";
const FingerDir = "fingerPrint2/";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height - 70;
const GROUNDCOLOR = "#0bcacc";
const POINTCOLOR = "#ff6781";
const BACKGROUNDCOLOR = "#F4ECE6";
export default function FingerPrintScreen(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nameModlaVisible, setNameModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [currentFinger, setCurrentFinger] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [userList, setUserList] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.torch);
  const [cam, setCam] = useState(null);
  const OS = Platform.OS;
  const reduxState = useSelector((state) => state);
  const [left1, setLeft1] = useState(null);
  const [left2, setLeft2] = useState(null);
  const [left3, setLeft3] = useState(null);
  const [left4, setLeft4] = useState(null);
  const [left5, setLeft5] = useState(null);
  const [right1, setRight1] = useState(null);
  const [right2, setRight2] = useState(null);
  const [right3, setRight3] = useState(null);
  const [right4, setRight4] = useState(null);
  const [right5, setRight5] = useState(null);
  const [fingerCount, setFingerCount] = useState(0);
  const [uid, setUid] = useState("");

  useEffect(() => {
    // console.log(props)
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      ensureDirExists();
      getFingerUser();
      getFingers("");
      const u = await auth.getAuth().currentUser.uid;
      setUid(u);
    })();
  }, []);

  const ensureDirExists = async () => {
    const dir = FileSystem.documentDirectory + FingerDir;
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      console.log("directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    } else {
      console.log("directory alreay exists");
    }
  };

  const uploadFingerPrint = async () => {
    const metadata = {
      contentType: 'image/jpg',
    };
    const s = storage.getStorage();
    for(var i=1; i<6; i++){
      const picture = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + FingerDir + encodeURI(currentName)+'/left'+i+'.jpg'
      );
      const file = await fetch(FileSystem.documentDirectory + FingerDir + encodeURI(currentName)+'/left'+i+'.jpg')
      const sRef = storage.ref(s, uid+'/'+currentName+'/'+'left'+i+'.jpg')
      // console.log(file)
      const upload = storage.uploadBytes(sRef, file, metadata)
    }
    for(var i=1; i<6; i++){
      const picture = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + FingerDir + encodeURI(currentName)+'/right'+i+'.jpg'
      );
      // console.log(picture)
      const sRef = storage.ref(s, uid+'/'+currentName+'/'+'right'+i+'.jpg')
      const upload = storage.uploadBytes(sRef, picture.uri, metadata)
    }
    console.log('upload file complete')
  }

  const uploadPrint = async () => {
    const metadata = {
      contentType: 'image/jpg',
    };
    const s = storage.getStorage();
    for(var i=1; i<6; i++){
      const localPath = FileSystem.documentDirectory + FingerDir + encodeURI(currentName)+'/right'+i+'.jpg'
      const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response)
      };
      xhr.onerror = function(e) {
        reject(new TypeError("Network request failed"));
      }
      xhr.responseType = "blob";
      xhr.open("GET", localPath, true);
      xhr.send(null);
    })
    const sRef = storage.ref(s, uid+'/'+currentName+'/'+'right'+i+'.jpg')
    const upload = storage.uploadBytes(sRef, blob, metadata)
    blob.close();
    }
    for(var i=1; i<6; i++){
      const localPath = FileSystem.documentDirectory + FingerDir + encodeURI(currentName)+'/left'+i+'.jpg'
      const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response)
      };
      xhr.onerror = function(e) {
        reject(new TypeError("Network request failed"));
      }
      xhr.responseType = "blob";
      xhr.open("GET", localPath, true);
      xhr.send(null);
    })
    const sRef = storage.ref(s, uid+'/'+currentName+'/'+'left'+i+'.jpg')
    const upload = storage.uploadBytes(sRef, blob, metadata)
    blob.close();
    }
    console.log('upload file complete')
  }

  const submitBoard = async () => {
    const uid = auth.getAuth().currentUser.uid
    let name = "";
    const docRef = db.doc(
      db.getFirestore(),
      "users",
      uid
    );
    const docSnap = await db.getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      name = docSnap.data().name;
    } else {
      console.log("No such document!");
      name="비회원"
    }
    
    try {
      await db.addDoc(db.collection(db.getFirestore(), "fingerprint"), {
        check: false,
        contents: '문의 내용',
        date: '01/22',
        reply: '',
        replier: '',
        birth: '',
        title: currentName,
        uid: uid,
        user: name
      });
    } catch (error) {
      console.log("DB error : "+error)
    }
    // Alert.alert("알림", "문의글 작성완료.")
  }


  const getFingerUser = async () => {
    const users = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + FingerDir
    );
    const userlist = await Promise.all(
      users.map((e) => {
        return e;
      })
    );
    setUserList(userlist);
  };

  const countFingerPrint = async (name) => {
    const users = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + FingerDir + encodeURI(name)
    );
    const fingerprint = await Promise.all(
      users.map((e) => {
        return e;
      })
    );
    setFingerCount(fingerprint.length)
    // const count = fingerprint.length
    // return count;
  };

  const getFingers = async (currentName2) => {
    setLeft1(
      await FileSystem.getInfoAsync(
        FileSystem.documentDirectory +
          FingerDir +
          encodeURI(currentName2) +
          "/" +
          "left1.jpg"
      )
    );
    setLeft2(
      await FileSystem.getInfoAsync(
        FileSystem.documentDirectory +
          FingerDir +
          encodeURI(currentName2) +
          "/" +
          "left2.jpg"
      )
    );
    setLeft3(
      await FileSystem.getInfoAsync(
        FileSystem.documentDirectory +
          FingerDir +
          encodeURI(currentName2) +
          "/" +
          "left3.jpg"
      )
    );
    setLeft4(
      await FileSystem.getInfoAsync(
        FileSystem.documentDirectory +
          FingerDir +
          encodeURI(currentName2) +
          "/" +
          "left4.jpg"
      )
    );
    setLeft5(
      await FileSystem.getInfoAsync(
        FileSystem.documentDirectory +
          FingerDir +
          encodeURI(currentName2) +
          "/" +
          "left5.jpg"
      )
    );
    setRight1(
      await FileSystem.getInfoAsync(
        FileSystem.documentDirectory +
          FingerDir +
          encodeURI(currentName2) +
          "/" +
          "right1.jpg"
      )
    );
    setRight2(
      await FileSystem.getInfoAsync(
        FileSystem.documentDirectory +
          FingerDir +
          encodeURI(currentName2) +
          "/" +
          "right2.jpg"
      )
    );
    setRight3(
      await FileSystem.getInfoAsync(
        FileSystem.documentDirectory +
          FingerDir +
          encodeURI(currentName2) +
          "/" +
          "right3.jpg"
      )
    );
    setRight4(
      await FileSystem.getInfoAsync(
        FileSystem.documentDirectory +
          FingerDir +
          encodeURI(currentName2) +
          "/" +
          "right4.jpg"
      )
    );
    setRight5(
      await FileSystem.getInfoAsync(
        FileSystem.documentDirectory +
          FingerDir +
          encodeURI(currentName2) +
          "/" +
          "right5.jpg"
      )
    );
    console.log("Load FingerPrint Status");
  };

  const Fingers = ({ fingerName, finger, fingerURL }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCurrentFinger(finger);
          if (fingerURL.exists) {
            console.log("exists");
            setPhotoModalVisible(true);
          } else {
            console.log("not exists");
            setCameraModalVisible(true);
          }
		  setModalVisible(false)
        }}
      >
        <View style={styles.fingerContainer}>
          <Image
            style={{
              tintColor: fingerURL.exists ? GROUNDCOLOR : "black",
            }}
            source={require("../../assets/images/photo/finger.png")}
          />
          <Text style={styles.fingerText}>{fingerName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const PhotoModal = () => {
    const URI =
      FileSystem.documentDirectory +
      FingerDir +
      encodeURI(currentName + "/" + currentFinger + ".jpg");
    console.log("IRI : ");
    console.log(URI);
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => {
              setPhotoModalVisible(false);
			  setModalVisible(true)
            }}
          >
            <View
              style={{
                height: 32,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={require("../../assets/images/photo/x.png")} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 5,
                }}
              >
                창 닫기
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              FileSystem.deleteAsync(URI);
              getFingers(currentName);
              // Alert.alert("알림", "사진 삭제완료.");
			  setModalVisible(true)
              setPhotoModalVisible(false);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={require("../../assets/images/photo/trash.png")} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 5,
                }}
              >
                사진 삭제
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderWidth: 2,
            borderColor: "grey",
            width: DEVICE_WIDTH,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            resizeMode="cover"
            style={{
              width: DEVICE_WIDTH - 5,
              height: (DEVICE_WIDTH - 5) * 1.75,
            }}
            source={{ uri: URI }}
          />
        </View>
      </View>
    );
  };

  const snap = async () => {
    if (cam) {
      const options = { quality: 0.3}
      const photo = await cam.takePictureAsync(options);
      const newURI =
        FileSystem.documentDirectory +
        FingerDir +
        encodeURI(currentName) +
        "/" +
        currentFinger +
        ".jpg";
      console.log(photo);
      console.log("new uri : " + newURI);
      // await FileSystem.deleteAsync(newURI);
      await FileSystem.moveAsync({
        from: photo.uri,
        to: newURI,
      });
      // Alert.alert("알림", "사진 저장완료");
      getFingers(currentName);
      setCameraModalVisible(false);
      setPhotoModalVisible(true);
    }
  };

  const FingerPrintModal = () => {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => {
              getFingerUser();
              setModalVisible(false);
              setCurrentName("");
            }}
          >
            <View
              style={{
                height: 32,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={require("../../assets/images/photo/x.png")} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 5,
                }}
              >
                창 닫기
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              //Directory 삭제
              console.log("delete directory");
              await FileSystem.deleteAsync(
                FileSystem.documentDirectory + FingerDir + encodeURI(currentName) + "/"
              );
              getFingerUser();
              setModalVisible(false);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={require("../../assets/images/photo/trash.png")} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 5,
                }}
              >
                지문 삭제
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>
          {currentName}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: DEVICE_WIDTH,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>왼손</Text>
            <Fingers fingerName={"엄지"} finger={"left1"} fingerURL={left1} />
            <Fingers fingerName={"검지"} finger={"left2"} fingerURL={left2} />
            <Fingers fingerName={"중지"} finger={"left3"} fingerURL={left3} />
            <Fingers fingerName={"약지"} finger={"left4"} fingerURL={left4} />
            <Fingers fingerName={"소지"} finger={"left5"} fingerURL={left5} />
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>오른손</Text>
            <Fingers fingerName={"엄지"} finger={"right1"} fingerURL={right1} />
            <Fingers fingerName={"검지"} finger={"right2"} fingerURL={right2} />
            <Fingers fingerName={"중지"} finger={"right3"} fingerURL={right3} />
            <Fingers fingerName={"약지"} finger={"right4"} fingerURL={right4} />
            <Fingers fingerName={"소지"} finger={"right5"} fingerURL={right5} />
          </View>
        </View>
        <TouchableOpacity
          underlayColor={"transparent"}
          onPress={() => {
            countFingerPrint(currentName);
            console.log(fingerCount)
            if(fingerCount === 10){
              // uploadFingerPrint();
              uploadPrint();
              // submitBoard();
              getFingerUser();
              setModalVisible(false);
            }else{
              Alert.alert("알림","10개의 지문을 모두 등록해주세요.")
            }
            
          }}
        >
          <View style={styles.menuButton}>
            <Text style={styles.menuText}>상담등록</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (hasPermission === null) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

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
      <FlatList
        data={userList}
        extraData={userList}
        keyExtractor={(item) => item}
        renderItem={(item) => {
          return (
            <TouchableOpacity
              underlayColor={"transparent"}
              onPress={() => {
                setCurrentName(item.item);
                console.log(item.item)
                getFingers(item.item);
                countFingerPrint(item.item);
                setModalVisible(true);
              }}
            >
              <View style={styles.menuButton}>
                <Text style={styles.menuText}>{item.item}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity
        underlayColor={"transparent"}
        onPress={() => setNameModalVisible(true)}
      >
        <View style={styles.addButton}>
          <Text style={styles.menuText}>지문 추가</Text>
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible}>
        <FingerPrintModal />
      </Modal>
      <Modal
        visible={nameModlaVisible}
        transparent={true}
        useNativeDriver={true}
        // hideModalContentWhileAnimating={true}
      >
        <View style={styles.modalContainer2}>
          <View style={styles.modalCon2}>
            <View style={styles.modalHeader2}>
              <Text style={{ fontSize: 20, color: "white" }}>이름 입력</Text>
            </View>
            <View style={styles.modalContents}>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => {
                    setCurrentName(text);
                  }}
                  value={currentName}
                ></TextInput>
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={async () => {
                    if (currentName.trim() === "") {
                      return Alert.alert("알림", "이름을 입력해주세요!");
                    } else {
                      const dir =
                        FileSystem.documentDirectory +
                        FingerDir +
                        encodeURI(currentName) +
                        "/";
                      console.log(dir);
                      const dirExist = await FileSystem.getInfoAsync(
                        FileSystem.documentDirectory +
                          FingerDir +
                          encodeURI(currentName) +
                          "/"
                      );
                      if (dirExist.exists) {
                        return Alert.alert(
                          "알림",
                          "해당 인물의 지문이 이미 등록되어있습니다."
                        );
                      } else {
                        await FileSystem.makeDirectoryAsync(dir, {
                          intermediates: true,
                        });
                        setNameModalVisible(false);
                        getFingers(currentName);
                        setModalVisible(true);
                      }
                    }
                  }}
                >
                  <View style={styles.button}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 17,
                      }}
                    >
                      확인
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentName("");
                    setNameModalVisible(false);
                  }}
                >
                  <View style={styles.button2}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 17,
                      }}
                    >
                      취소
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
      <Modal visible={cameraModalVisible} transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setCameraModalVisible(false);
			        	setModalVisible(true)
              }}
            >
              <View
                style={{
                  height: 32,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image source={require("../../assets/images/photo/x.png")} />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginLeft: 5,
                  }}
                >
                  창 닫기
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("알림", "사진 삭제완료.");
                setCameraModalVisible(false);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/images/photo/trash.png")}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginLeft: 5,
                  }}
                >
                  삭제
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Camera
            style={styles.camera}
            type={type}
            flashMode={flash}
            ratio={"16:9"}
            zoom={OS === "android" ? 0.6 : 0.03}
            autoFocus={Camera.Constants.AutoFocus.on}
            ref={(ref) => {
              setCam(ref);
            }}
          ></Camera>

          <TouchableOpacity
            onPress={() => {
              console.log("caputred");
              snap();
            }}
            style={styles.captureButton}
          >
            <View
              style={{
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 18 }}>지문 촬영</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
	  <Modal visible={photoModalVisible} transparent={false}>
        <PhotoModal />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
  menuTab: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.35,
    height: 40,
    borderBottomColor: "grey",
    borderBottomWidth: 3,
    // paddingVertical: 5
  },
  menuTabActive: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.35,
    height: 40,
    borderBottomColor: POINTCOLOR,
    borderBottomWidth: 3,
    // paddingVertical: 5
  },
  menuTabText: {
    fontSize: 20,
  },
  menuTabTextActive: {
    fontSize: 20,
    color: POINTCOLOR,
  },
  menuText: {
    fontSize: 20,
    color: "white",
    // fontFamily: "SquareRound",
    fontWeight: "bold",
  },
  menuButton: {
    backgroundColor: GROUNDCOLOR,
    height: DEVICE_HEIGHT * 0.06,
    width: DEVICE_WIDTH * 0.65,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    // justifyContent: "center",
    paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
	paddingBottom: Platform.OS ==='ios' ? 40 : 0,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  modalHeader: {
    flexDirection: "row",
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * 0.12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: "grey",
    paddingHorizontal: 10,
  },
  modalContainer2: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCon2: {
    borderRadius: 10,
    backgroundColor: "#fff",
    // paddingVertical: 30,
    // paddingHorizontal: 10,
    width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.5,
    alignItems: "center",
  },
  modalHeader2: {
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.12,
    backgroundColor: GROUNDCOLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContents: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.38,
  },
  textInputContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.23,
    flexDirection: "row",
    paddingTop: 10,
    marginHorizontal: 10,
  },
  textInput: {
    borderColor: GROUNDCOLOR,
    borderWidth: 2,
    borderRadius: 4,
    width: DEVICE_WIDTH * 0.65,
    height: DEVICE_WIDTH * 0.13,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  modalButtonContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    // width: DEVICE_WIDTH * 0.7,
    height: DEVICE_WIDTH * 0.15,
    flexDirection: "row",
    marginHorizontal: 20,
  },
  button: {
    fontSize: 20,
    // borderWidth: 1,
    // borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: GROUNDCOLOR,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.23,
    height: DEVICE_WIDTH * 0.1,
    marginHorizontal: DEVICE_WIDTH * 0.05,
  },
  button2: {
    fontSize: 20,
    // borderWidth: 1,
    // borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: "grey",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    width: DEVICE_WIDTH * 0.23,
    height: DEVICE_WIDTH * 0.1,
    marginHorizontal: DEVICE_WIDTH * 0.05,
  },
  addButton: {
    backgroundColor: POINTCOLOR,
    height: DEVICE_HEIGHT * 0.06,
    width: DEVICE_WIDTH * 0.65,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  fingerContainer: {
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: GROUNDCOLOR,
    borderRadius: 5,
    paddingTop: 3,
    paddingHorizontal: 15,
  },
  fingerText: {
    fontWeight: "bold",
  },
  camera: {
    flex: 1,
    width: DEVICE_WIDTH,
  },
});
