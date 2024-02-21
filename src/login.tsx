import { Flex, Box, Image, Text, FormControl, FormLabel, Input, Button, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { BsFillEyeSlashFill, BsFillEyeFill  } from "react-icons/bs";
import { Link } from "react-router-dom";


function Login(){
    
    const [seePassword, setSeePassword] = useState(false);

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
                            <Input type='text'/>
                        </Box>

                        <Box>
                            <FormLabel>Senha</FormLabel>
                            <InputGroup>
                                <Input type={seePassword ? 'text' : 'password'} />
                                <InputRightElement onClick={()=>setSeePassword(!seePassword)}>
                                    {!seePassword ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                                </InputRightElement>
                            </InputGroup>
                        </Box>

                        <Box mt={8}>
                            <Link to='/home'>
                                <Button colorScheme='purple' w={'100%'}>Entrar</Button>
                            </Link>
                        </Box>
                    </FormControl>  
                </Box>
            </Box>
        </Flex>
    );
}

export default Login;