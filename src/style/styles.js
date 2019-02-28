import {StyleSheet,Dimensions,StatusBar} from "react-native";
var {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    ImageBackground:{
        width,
        flex:1
    },
    contentContainer:{
        flexDirection: 'row',
        marginTop:StatusBar.currentHeight,
        marginLeft:20,
        marginBottom:StatusBar.currentHeight,
    },
    row:{
        flex: 1,
        flexDirection: 'row',
        justifyContent:'space-between',
        margin:10,
        alignItems:'center'
    },
    between:{
        flexDirection: 'row',
        justifyContent:'space-between',
        padding:10,
        alignItems:'center'
    },
    row2:{
        flexDirection: 'row',
        justifyContent:'center',
        margin:10,
        alignItems:'center'
    },
    row1:{
        flexDirection: 'row',
        alignItems:'center'
    },
    cityContainer:{
        marginLeft:20,
    },
    column:{
        flex:1,
        flexDirection:'column',
        margin:15,
        alignItems:'center'

    },
    text:{
        color:'white',
        fontSize:18
    },
    margin:{
        marginLeft:10,
        marginRight:10
    }
})
export default styles;