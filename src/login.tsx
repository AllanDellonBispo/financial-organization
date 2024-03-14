import { Flex, Box, Image, Text, FormControl, FormLabel, Input, Button, InputGroup, InputRightElement, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { BsFillEyeSlashFill, BsFillEyeFill  } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {useLoggedUser } from "./contexts/LoggedUser";


function Login(){
    
    const [seePassword, setSeePassword] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const toast = useToast();
    const { loginUser } = useLoggedUser();

    const handleLoginError = () => {
        toast({
            title: 'Login ou senha incorretos',
            description: '',
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: 'top-left',
        });
    }

    const checkLogin = async () => {
        try {
          await loginUser(email, password);
          navigate("/home");
        } catch (error) {
          handleLoginError();
        }
      }

    return(
        <Flex>
            <Box backgroundColor={'blue'} h={'100vh'} w={'100%'}>
                <Image src='https://i.pinimg.com/originals/17/44/d3/1744d3412a811c1b4fd31de42c9ffc98.jpg' alt='Dan Abramov' h={'100%'} w={'100%'} />
            </Box>

            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} h={'100vh'} w={'100%'}>

                <Box mb={20}>
                    <Text fontSize={50}>Monte Moriá</Text>
                </Box>

                <Box w={'400px'} h={'400px'} borderRadius={4} boxShadow='2xl'>
                    <Box textAlign={'center'} mt={6}>
                        <Text fontSize={22} fontWeight={'bold'}>Faça login na sua conta</Text>
                    </Box> 

                    <FormControl mt={14} pl={4} pr={4}>
                        <Box mb={6}>
                            <FormLabel>Login</FormLabel>
                            <Input type='text' onChange={(e)=> setEmail(e.target.value)}/>
                        </Box>

                        <Box>
                            <FormLabel>Senha</FormLabel>
                            <InputGroup>
                                <Input type={seePassword ? 'text' : 'password'} onChange={(e)=> setPassword(e.target.value)}/>
                                <InputRightElement onClick={()=>setSeePassword(!seePassword)}>
                                    {!seePassword ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                                </InputRightElement>
                            </InputGroup>
                        </Box>

                        <Box mt={8}>
                                <Button colorScheme='purple' w={'100%'} onClick={checkLogin}>Entrar</Button>
                        </Box>
                    </FormControl>  
                </Box>
            </Box>
        </Flex>
    );
}

export default Login;