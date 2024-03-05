import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";

type Props = {
    title: string;
    onClick: () => void;
}

export const Header = ({title, onClick}:Props) =>{
    return(
        <Heading>
        <Flex bg={'#4B0082'} color={'white'} h={'120px'} fontSize={28} display={'flex'} justifyContent={'space-between'} align={'center'}>
          <Box ml={'4%'}>
            <TiThMenu size={'10%'} onClick={onClick}/>
          </Box>
          <Text>{title}</Text>
          <Box>
            <RiMoneyDollarCircleLine size={'20%'}/>
          </Box>
        </Flex>
      </Heading>
    );
}