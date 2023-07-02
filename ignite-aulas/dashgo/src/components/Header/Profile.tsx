import { Box, Flex, Text, Avatar } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      { showProfileData && (
        <Box mr="4" textAlign="right">
            <Text>Andressa Gaspar</Text>
            <Text 
              color="gray.300" 
              fontSize="small"
            >
              andressa.mgaspar@gmail.com
            </Text>
          </Box>
        )}

    <Avatar size="md" name="Andressa Gaspar" />
  </Flex>
  )
}