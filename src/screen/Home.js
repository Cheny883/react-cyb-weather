import React,{Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    Image,
    ImageBackground,
    FlatList,
    TouchableNativeFeedback,
    Dimensions,
    ViewPagerAndroid,
    AsyncStorage,
    RefreshControl,
    ToastAndroid,
    PermissionsAndroid} from 'react-native';
import styles from '../style/styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
var {height, width} = Dimensions.get('window');
import Hr from './Hr'
import SplashScreen from 'react-native-splash-screen'
import PercentageCircle from 'react-native-percentage-circle';
import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Use,
    Defs,
    Stop
} from 'react-native-svg';
global.__this__ = null;
import Geolocation from 'Geolocation'



import {TabNavigator,DrawerNavigator,DrawerActions,TabBarBottom,StackNavigator} from 'react-navigation'
class Home extends Component{
    async requestLocationPermission(){
        try{
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': '我要地址查询权限',
                    'message': '没权限我不能工作，同意就好了'
                }
            )
            if(granted==PermissionsAndroid.RESULTS.GRANTED){
                this.getCurrentPosition()
            }else{
                ToastAndroid.show('获取位置权限失败',ToastAndroid.SHORT);
            }
        }catch(err){
            ToastAndroid.show(err.toString())
        }
    }
    async reloaders(){
        await fetch('https://restapi.amap.com/v3/geocode/regeo?key=ba81e4f87e092b42f448bbfa056b3040&poitype=all&radius=3000&output=json&extensions=all&roadlevel=0&location='+this.state.JinWei)
            .then((response)=>{
                if (response.status == 200){
                    return response.json();
                }
            })
            .then((Jsonp)=>{
                let district = Jsonp.regeocode.addressComponent.district;
                this.state.name = district.slice(0,-1);
                this.setState({name:this.state.name})
                console.log(this.state.name)
            })
    }
    async getCurrentPosition(){
        await Geolocation.getCurrentPosition(val => {
            let JinWei = `${val.coords.longitude},${val.coords.latitude}`
            this.setState({JinWei});
            this.reloaders();
        },val => {
            let JinWei = '获取坐标失败：' + val;
            console.log('error',JinWei)
        })
    }
    constructor(){
        super()
        __this__ = this
    }
    componentDidMount(){
        __refresh__ = this.refresh;
        this.refresh();
        this.requestLocationPermission();
        SplashScreen.hide();
        this.update();
    }
    async update(){
        image = await AsyncStorage.getItem('Image') ? await AsyncStorage.getItem('Image') : require('../Img/background.jpg');
        if(typeof image !=  'number')image = await JSON.parse(image);
        await this.setState({
            image
        })
    }
    state=({
        JinWei:null,
        loading:false,
        daily_forecast:[],
        hourly_forecast:[],
        now:'',
        code:'',
        wind:{},
        name:'湘桥',
        qlty:null,
        aqi:null,
        city:null,
        hum:null,
        fl:null,
        suggestion:null,
        image: require('../Img/background.jpg')
    })

    async refresh(text=this.state.name){
        this.setState({loading:true})
        await fetch("https://free-api.heweather.com/v5/weather?key=19713447578c4afe8c12a351d46ea922&city=" + text)
            .then((response) => {
                if (response.ok){
                    return response.json();
                }
            })
            .then((jsonData) => {
                let weatherData = jsonData.HeWeather5[0];
                this.setState({daily_forecast:weatherData.daily_forecast})
                this.setState({hourly_forecast:weatherData.hourly_forecast})
                this.setState({now:weatherData.now})
                this.setState({code:weatherData.now.cond.code})
                this.setState({wind:weatherData.now.wind})
                this.setState({name:text})
                this.setState({city:weatherData.aqi.city})
                this.setState({aqi:this.state.city.aqi})
                this.setState({qlty:this.state.city.qlty})
                this.setState({hum:this.state.now.hum});
                this.setState({fl:this.state.now.fl});
                this.setState({suggestion:weatherData.suggestion});
            })
            .catch((error) => {
                console.log("获取天气数据失败，结束当前网络请求天气数据" + error);
            }).finally(()=>{
                this.setState({loading:false})
            })
    }
    render(){
        const number = parseInt(this.state.aqi/3);
        var city = [];for(var key in this.state.city){
            if(!(key == 'aqi' || key == 'qlty')){
                city.push({title:key,value:this.state.city[key]})
            }
        }
        var suggestion = [];
        for(var key in this.state.suggestion){
            suggestion.push(this.state.suggestion[key])
        }
        return(
            <ImageBackground
                source={this.state.image}
                style={styles.ImageBackground}
            >
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} hidden={true}/>
                <View style={styles.contentContainer}>
                    <TouchableNativeFeedback onPress={()=>{this.props.navigation.dispatch(DrawerActions.toggleDrawer())}}>
                        <Ionicons name='md-menu' color={'white'} size={30} style={{backgroundColor: 'transparent'}}/>
                    </TouchableNativeFeedback>
                    <View style={styles.cityContainer}>
                        <Text style={{fontSize:16,color:'white'}}>{this.state.name}</Text>
                    </View>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator ={false}
                    refreshControl = {<RefreshControl
                        refreshing={this.state.loading}
                        onRefresh={this.refresh.bind(this)}
                        tintColor={'white'}
                        titleColor={'white'}/>}>
                    <View style={styles.column}>
                        <Text style={{color:'white',fontSize:32}}>{`${this.state.now.tmp}℃`}</Text>
                        <Image style={{width:80,height:80,tintColor:'white'}} source={{uri:'https://cdn.heweather.com/cond_icon/'+this.state.code+'.png'}}/>
                        <Text style={{color:'white',fontSize:24}}>{this.state.wind.dir+'--'+this.state.wind.sc+'级'}</Text>
                    </View>
                    <Hr/>
                    <FlatList
                        extraData={this.state}
                        showsHorizontalScrollIndicator = {false}
                        data={this.state.hourly_forecast}
                        horizontal={true}
                        style = {styles.margin}
                        renderItem={({item})=>{
                            return(
                                <View style={styles.column}>
                                    <Text style={styles.text}>{item.tmp}℃</Text>
                                    <Image style={{width:40,height:40,tintColor:'white'}} source={{uri:'https://cdn.heweather.com/cond_icon/'+item.cond.code+".png"}}/>
                                    <Text style={styles.text}>{item.date.slice(10,16)}</Text>
                                </View>
                            )
                        }}/>
                    <FlatList
                        extraData={this.state}
                        data={this.state.daily_forecast}
                        renderItem={
                            ({item})=>{
                                return(<View style={styles.row}>
                                        <Text style={styles.text}>{item.date.slice(8,10)+'日'}</Text>
                                        <View style={styles.row1}>
                                            <Image style={{width:40,height:40,tintColor:'white'}} source={{uri:'https://cdn.heweather.com/cond_icon/'+item.cond.code_d+".png"}}/>
                                            <Text style={styles.text}>{item.cond.txt_d}</Text>
                                        </View>
                                        <Text style={styles.text}>{`${item.tmp.min}～${item.tmp.max}℃`}</Text>
                                    </View>
                                )
                            }
                        }
                    />
                    <ViewPagerAndroid style={[{height:200,marginTop:10},styles.margin]}>
                        <View style={styles.row}>
                            <PercentageCircle radius={75} percent={number} bgcolor={"#3498db"} color={'gray'}>
                                <Text>{this.state.aqi}</Text>
                                <Text>{this.state.qlty}</Text>
                            </PercentageCircle>
                            <View style={{flex:1}}>
                                <FlatList
                                 extraData={this.state}
                                data = {city}
                                ListHeaderComponent = {()=>(<View style={styles.row2}><Text style={styles.text}>{'污染物'}</Text></View>)}
                                ItemSeparatorComponent = {Hr}
                                renderItem={({item})=>{
                                    return <View style={[{
                                        flexDirection: 'row',
                                        justifyContent:'space-between',
                                        alignItems:'center'},styles.margin]}><Text style={{color:'white'}}>{item.title}</Text><Text style={{color:'white'}}>{item.value}</Text></View>}}/>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <PercentageCircle radius={75} percent={this.state.hum} bgcolor={"#3498db"} color={'gray'}>
                                <Text>{`${this.state.hum}%`}</Text>
                                <Text>{'空气湿度'}</Text>
                            </PercentageCircle>
                            <View style={styles.row}><Text style={styles.text}>{'体感温度'}</Text><Text style={styles.text}>{`${this.state.fl}℃`}</Text></View>
                        </View>
                    </ViewPagerAndroid>
                    <View style={{flex:1}}>
                        <FlatList
                            extraData={this.state}
                            data = {suggestion}
                            renderItem = {({item})=>{
                                return (
                                    <View style={styles.row2}>
                                        <Ionicons name={'ios-add'}  size={40} color={'white'}/>
                                        <View style={styles.column}>
                                            <Text style={[styles.text]}>{`指数：${item.brf}`}</Text><Text style={styles.text}>{item.txt}</Text>
                                        </View>
                                    </View>
                                )
                            }}/>
                    </View>
                </ScrollView>
            </ImageBackground>
        )
    }
}

import BottomNav,{Setting} from './Drawer'
const HomeDrawer = DrawerNavigator(
    {Home},
    {
        contentComponent:props =>
                <BottomNav/>
}
)
const HomeStack = StackNavigator({
    HomeDrawer:{screen:HomeDrawer,
        navigationOptions : ()=>({
            header:null
        })},Setting
},{
    headerMode:'float',
    navigationOptions:{
        gesturesEnabled:true
    }
})
export default HomeStack;