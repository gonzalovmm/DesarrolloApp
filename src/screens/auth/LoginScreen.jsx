import { StyleSheet, Text, View, TextInput, Pressable, Dimensions,Platform, KeyboardAvoidingView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../global/colors'
import { useState, useEffect } from 'react';
import { setUser } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../services/authService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { insertSession, clearSessions } from '../../db';
import Toast from 'react-native-toast-message';

const textInputWidth = Dimensions.get('window').width * 0.7

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const [triggerLogin, result] = useLoginMutation();

  useEffect(() => {
    if (result.isSuccess) {
      console.log("Usuario logueado con éxito");
      dispatch(setUser(result.data));

      if (rememberMe) {
        clearSessions()
          .then(() => console.log("sesiones eliminadas"))
          .catch(error => console.log("Error al eliminar las sesiones: ", error));
        console.log("result data:", result.data);
        insertSession({
          localId: result.data.localId,
          email: result.data.email,
          token: result.data.idToken
        })
          .then(res => console.log("Usuario insertado con éxito", res))
          .catch(error => console.log("Error al insertar usuario", error));
      }
    } else if (result.isError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Usuario no encontrado. Verifica tu email y contraseña.',
      });
      setEmail("");
      setPassword("");
    }
  }, [result, rememberMe]);

  const onsubmit = () => {
    triggerLogin({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <LinearGradient
        colors={['#002e21', '#007e54', '#67eeb1']}
        style={styles.gradient}
      >
        <Text style={styles.title}>Super Cuyo</Text>
        <Text style={styles.subTitle}>Ingreso</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholderTextColor="#C7C7C7"
            backgroundColor="#cffce3"
            placeholder="Email"
            style={styles.textInput}
          />
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholderTextColor="#C7C7C7"
            placeholder='Contraseña'
            style={styles.textInput}
            secureTextEntry
          />
        </View>
        <View style={styles.rememberMeContainer}>
          <Text style={styles.whiteText}>Mantener sesión iniciada</Text>
          {
            rememberMe
              ?
              <Pressable onPress={() => setRememberMe(!rememberMe)}><Icon name="toggle-on" size={48} color={colors.verdeClaro} /></Pressable>
              :
              <Pressable onPress={() => setRememberMe(!rememberMe)}><Icon name="toggle-off" size={48} color={colors.verdeLight} /></Pressable>
          }
        </View>
        <Pressable style={styles.btn} onPress={onsubmit}><Text style={styles.btnText}>Iniciar sesión</Text></Pressable>
        <View style={styles.footTextContainer}>
          <Text style={styles.whiteText}>¿No tienes una cuenta?</Text>
          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text style={
              {
                ...styles.whiteText,
                ...styles.underLineText
              }
            }>
              Crea una
            </Text>
          </Pressable>
        </View>
        <View style={styles.guestOptionContainer}>
          <Text style={styles.whiteText}>¿Solo quieres dar un vistazo?</Text>
          <Pressable onPress={() => dispatch(setUser({ email: "demo@supercuyo.com", token: "demo" }))}>
            <Text style={{ ...styles.whiteText, ...styles.strongText }}>Ingresa como invitado</Text>
          </Pressable>
        </View>
      </LinearGradient>
      <Toast/>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        flex:1
    },  
    gradient: {
        backgroundColor: colors.verdeSuper,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    title: {
        color: colors.blanco,
        fontFamily: "BebasNeue",
        fontSize: 64
    },
    subTitle: {
        fontFamily: "Montserrat",
        fontSize: 20,
        color: colors.blanco,
        fontWeight: '700',
        letterSpacing: 3
    },
    inputContainer: {
        gap: 16,
        margin: 16,
        marginTop: 48,
        alignItems: 'center',
    },
    textInput: {
        padding: 8,
        paddingLeft: 16,
        borderRadius: 16,
        backgroundColor: colors.verdeClaro,
        width: textInputWidth,
        color: colors.blanco,
    },
    footTextContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    whiteText: {
        color: colors.blanco,
        fontSize: 18,
    },
    underLineText: {
        textDecorationLine: 'underline',
    },
    strongText: {
        fontWeight: '900',
        fontSize: 18
    },
    btn: {
        padding: 16,
        paddingHorizontal: 32,
        backgroundColor: colors.verdeClaro,
        borderRadius: 16,
        marginVertical: 10
    },
    btnText: {
        color: colors.blanco,
        fontSize: 16,
        fontWeight: '700'
    },
    guestOptionContainer: {
        alignItems: 'center',
        marginTop: 64
    },
    rememberMeContainer: {
        flexDirection: "row",
        gap: 5,
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 8,
    }
})