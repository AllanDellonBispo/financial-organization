import { Flex, IconButton, Text } from "@chakra-ui/react";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";

type Props = {
    displayPrevious:boolean;
    displayNext:boolean;
    numberPage: number;
    prevPageButton: ()=> void;
    nextPageButton: ()=> void;
}


export const Pagination = ({displayPrevious, displayNext, numberPage, prevPageButton, nextPageButton}: Props) => {
    return(
        <Flex justify='space-between' w='100%' >
        <IconButton
              as='button'
              bgColor='#4B0082'
              aria-label='Previous page'
              icon={<GrFormPreviousLink size={36} color="white"/>}
              onClick={prevPageButton}
              isDisabled={displayPrevious}/>
    
        <Text color='white' fontSize={22} fontWeight='bold' bg='#4B0082' pr={4} pl={4} borderRadius={4}>{numberPage}</Text>
    
        <IconButton
              bgColor='#4B0082'
              aria-label='Next page'
              icon={<GrFormNextLink size={36} />} onClick={nextPageButton} isDisabled={displayNext}/>
        </Flex>
    );
}