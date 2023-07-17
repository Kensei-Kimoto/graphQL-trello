import React from 'react'
import styled from '@emotion/styled'
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Stack } from '@mui/material';

const SnsButtons = styled.div`
  margin-bottom: 20px;
  display: grid;
  gap: 8px;
`

const Button = styled.a`
  display: grid;
  place-content: center;
  width: 60px;
  height: 60px;
  padding: 8px 12px;
  font-size: 14px;
  text-decoration: none;
  color: #0009;
`

type Props = {
  url: string
  title: string
}

const SnsBtn = ({ url, title }: Props) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <SnsButtons>
      <Stack spacing={4} direction='row' m={8} alignItems='center'>
        <Button href={`https://twitter.com/share?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer">
          <TwitterIcon fontSize='large'></TwitterIcon>
        </Button>
        <Button href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          <FacebookIcon fontSize='large'></FacebookIcon>
        </Button>
      </Stack>
    </SnsButtons>
  )
}

export default SnsBtn