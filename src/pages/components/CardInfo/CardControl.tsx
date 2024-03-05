import { Box, Button, CardBody, Flex, Text } from "@chakra-ui/react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { VscSettings } from "react-icons/vsc";

type Props = {
    previousMonth: () => Promise<void | undefined>;
    nextMonth: ()=> Promise<void | undefined>;
    month: string | undefined;
    onOpenSearch: ()=> Promise<void | undefined>;
    activeFilter: ()=> void;
    bg: string;
}

export const CardControl = ({previousMonth, nextMonth, month, activeFilter, onOpenSearch, bg}: Props) => {
    return(
        <CardBody>
        <Flex gap={4} alignItems={'center'}>
          <Button bg={'#4B0082'} _hover={{backgroundColor:'#7600ca'}} onClick={async ()=>{ await previousMonth(); activeFilter()}}>
            <AiOutlineArrowLeft color={'white'}/>
          </Button>
          <Text alignSelf={'center'}>{month}</Text>
          <Button bg={'#4B0082'} _hover={{backgroundColor:'#7600ca'}} onClick={async ()=>{await nextMonth(); activeFilter()}}>
            <AiOutlineArrowRight color={'white'}/>
          </Button>
          <Box>
            <Button onClick={async ()=> await onOpenSearch()} title='Filtrar' bg={String(bg)} >
              <VscSettings />
            </Button>
          </Box>
        </Flex>
      </CardBody>
    );
}