import Modal from '@mui/material/Modal';

export default function InfoModal(props) {

  return (
    <Modal
      open={props.open}
    >
      <div class = "flex h-screen w-full justify-center"> 
        <div class = "m-20">
          <p class = "text-3xl">{props.text}</p> 
          <p class = "text-xl">{props.subtext}</p> 
        </div>
      </div>
    </Modal>
  )
}