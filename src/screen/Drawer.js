import React,{Component} from "react";
import {
    View,
    Text,
    ImageBackground,
    ToolbarAndroid,
    TouchableNativeFeedback,
    BackHandler,
    Dimensions,
    FlatList,
    AsyncStorage,
    Image
} from 'react-native';
import styles from '../style/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Hr from "./Hr";
import Picker  from 'react-native-picker'
import CITY from '../Data/cityData'
import Swipeout from 'react-native-swipeout';
var {height, width} = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';
import {DrawerActions, TabBarBottom, TabNavigator} from "react-navigation";

var about = '';
class About extends Component{
    static navigationOptions  = ({ navigation, navigationOptions }) => {
        return {
            title: '关于'
        }
    }
    constructor(){
        super()
        about = this;
    }
    state = {
        data: [],
        imageSmall: require('../Img/small.jpg'),
    }
    componentDidMount(){
        this.updata();
    }
    async updata(){
        var result = await AsyncStorage.getItem('data');
        var jsonp = await JSON.parse(result) || []
        await this.setState({data:jsonp});
        this.gets();
    }
    picker(){
        Picker.init({
            pickerTitleText: '选择城市',
            pickerCancelBtnText:'取消',
            pickerConfirmBtnText: '确定',
            pickerData: CITY,
            selectedValue: ['广东省','潮州市','湘桥区'],
            onPickerConfirm: (selectedValue) => {
                var name = selectedValue[selectedValue.length-1].slice(0,-1)
                var aa = this.state.data.findIndex((item)=>{
                    return name == item.name
                })
                if(aa<0){
                    this.state.data.push({name});
                    this.setState({data:this.state.data})
                    __refresh__.call(__this__,name)
                }
                this.add();
            }
        })
        Picker.show()
    }

    async add(){
        var data = await JSON.stringify(this.state.data);
        await AsyncStorage.setItem('data',data);
    }
    reload(name){
        __this__.props.navigation.dispatch(DrawerActions.toggleDrawer())
        __refresh__.call(__this__,name)
    }
    async gets(){
        var imageSmall = await AsyncStorage.getItem('ImageSmall') ? await AsyncStorage.getItem('ImageSmall') :  require('../Img/small.jpg');

        if(typeof imageSmall !=  'number')imageSmall = await JSON.parse(imageSmall);
        await this.setState({
            imageSmall
        })

    }
    render(){
        return(
            <View style={{flex:1,paddingBottom:50}}>
                    <Image source={this.state.imageSmall}
                                     style={{width:300,height:height/4}}
                    />
                <TouchableNativeFeedback onPress={this.picker.bind(this)}>
                    <View style={styles.between}>
                        <Text style={{fontSize:18}}>选择城市</Text>
                        <Ionicons name={'ios-add'} size={30}/>
                    </View>
                </TouchableNativeFeedback>
                <FlatList
                        extraData={this.state}
                        data = {this.state.data}
                        ItemSeparatorComponent = {Hr}
                        renderItem =  {({item}) => {
                            var Delete = [{
                                component:<View style={[styles.row1,{flex:1,justifyContent:'center'}]}><Ionicons name='ios-trash' color={'white'} size={30}/></View>,
                                backgroundColor:'red',
                                onPress: async ()=>{
                                    var flag = this.state.data.findIndex((obj)=>{
                                        return obj.name === item.name
                                    })
                                    if(flag >= 0){
                                        this.state.data.splice(flag,1)
                                        this.setState({data:this.state.data})
                                    }
                                    var data = await JSON.stringify(this.state.data)
                                    await AsyncStorage.setItem('data',data)
                                }
                            }]
                            return (<Swipeout left={Delete} autoClose = {true} backgroundColor = {'transparent'} style={{marginLeft:10}}>
                                <TouchableNativeFeedback onPress={(name)=>{this.reload.call(this,item.name)}} ><View style={{padding:10}}><Text>{item.name}</Text></View></TouchableNativeFeedback>
                            </Swipeout>)
                        }}
                    />
            </View>
        )
    }
}
 export class Setting extends Component{
    static navigationOptions  = ({ navigate,navigationOptions }) => {
        return {
            title: '设置',
            tabBarOnPress:({router,index})=>{__this__.props.navigation.navigate('Setting')},
            header:null,
        }
    }
    state = {
        image: require('../Img/background.jpg'),
        small: require('../Img/small.jpg')
    }
    ImagePicker(){
        ImagePicker.openPicker({
            width,
            height,
            cropping: true,
            cropperCircleOverlay: false,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
        }).then((image) => {
            this.set(image.path);
        }).catch(e => {
            console.log(e);
            Alert.alert(e.message ? e.message : e);
        });
     }
     ImagePickerSmall(){
         ImagePicker.openPicker({
             width: 300,
             height: height/4,
             cropping: true,
             cropperCircleOverlay: false,
             compressImageMaxWidth: 640,
             compressImageMaxHeight: 480,
             compressImageQuality: 0.5,
             compressVideoPreset: 'MediumQuality',
             includeExif: true,
         }).then((image) => {
             this.setSmall(image.path);
         }).catch(e => {
             console.log(e);
             Alert.alert(e.message ? e.message : e);
         });
     }
     async set (imagepath){
        await AsyncStorage.setItem('Image',JSON.stringify({uri:imagepath}));
        await this.reloaderd();
        await __this__.update();
     }
     async setSmall (imagepath){
        await AsyncStorage.setItem('ImageSmall',JSON.stringify({uri:imagepath}));
        await about.gets();
        //  console.log(about)
     }
     async reloaderd(){
         image = await AsyncStorage.getItem('Image') ? await AsyncStorage.getItem('Image') : require('../Img/background.jpg');
         // var im = await AsyncStorage.getItem('image')
         // await console.log( await AsyncStorage.getItem('image'))
         if(typeof image !=  'number')image = await JSON.parse(image);
         await this.setState({
             image
         })
     }
     componentDidMount(){
        this.reloaderd();
     }
     reset(){
        AsyncStorage.clear();
        about.setState({imageSmall:require('../Img/small.jpg')});
        this.setState({image:require('../Img/background.jpg')});
        __this__.setState({image:require('../Img/background.jpg')})
        about.setState({data:null})
     }

    render(){
        return(
            <ImageBackground source={this.state.image} style={styles.ImageBackground}>
                <ToolbarAndroid
                    style={{height:50,backgroundColor:'transparent'}}>
                    <TouchableNativeFeedback onPress={()=>{this.props.navigation.goBack()}}>
                        <Ionicons   name={'ios-return-left'} size={40} color={'white'} />
                    </TouchableNativeFeedback>
                    <Text style={[styles.text,{paddingLeft:20}]}>设置</Text>
                </ToolbarAndroid>
                <TouchableNativeFeedback onPress={this.ImagePicker.bind(this)}>
                        <Text style={{color:'white',padding:10,fontSize:18}}>更改背景</Text>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.ImagePickerSmall.bind(this)}>
                        <Text style={{color:'white',padding:10,fontSize:18}}>更改侧边栏</Text>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this.reset.bind(this)}>
                        <Text style={{color:'white',padding:10,fontSize:18}}>重置</Text>
                </TouchableNativeFeedback>
                <View  style={[styles.row,{flex:0}]}>
                    <Text style={{color:'white',fontSize:18}}>版本</Text>
                    <Text style={{color:'white',fontSize:18}}>1.0</Text>
                </View>
            </ImageBackground>
        )
    }
}
class GoBack extends Component{
    static navigationOptions  = ({ navigation, navigationOptions }) => {
        return {
            title: '退出',
            tabBarOnPress:({router,index})=>{BackHandler.exitApp()}
        }
    }
    render(){
        return(
            <View>
                <Text style={styles.text}>退出</Text>
            </View>
        )
    }
}

const BottomNav = TabNavigator(
    {Setting,About,GoBack},
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'About') {
                    iconName = `ios-information-circle${focused ? '' : '-outline'}`;
                } else if (routeName === 'Setting') {
                    iconName = `ios-settings${focused ? '' : '-outline'}`;
                }else if(routeName === 'GoBack'){
                    iconName = `ios-exit${focused ? '' : '-outline'}`;
                }
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            },
        }),
        initialRouteName: 'About',
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
        animationEnabled: false,
        swipeEnabled: false,
    }
)
export default BottomNav;