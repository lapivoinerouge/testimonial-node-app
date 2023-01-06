import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Progress, Alert } from 'reactstrap';
import { getSeats, getRequests, loadSeats, getOccupiedSeats } from '../../../redux/seatsRedux';
import { io } from "socket.io-client";
import './SeatChooser.scss';
import { SERVER_URL } from '../../../config';

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const dispatch = useDispatch();
  const seats = useSelector(getSeats);
  const requests = useSelector(getRequests);
  const occupiedSeats = useSelector(state => getOccupiedSeats(state, parseInt(chosenDay)));

  useEffect(() => {
    const socket = io(SERVER_URL);
    socket.on('seatsUpdated', seats => {
      dispatch(loadSeats(seats));
    });
  }, []);

  const isTaken = (seatId) => {
    return (seats.some(item => (item.seat === seatId && item.day === chosenDay)));
  }

  const prepareSeat = (seatId) => {
    if(seatId === chosenSeat) return <Button key={seatId} className="seats__seat" color="primary">{seatId}</Button>;
    else if(isTaken(seatId)) return <Button key={seatId} className="seats__seat" disabled color="secondary">{seatId}</Button>;
    else return <Button key={seatId} color="primary" className="seats__seat" outline onClick={(e) => updateSeat(e, seatId)}>{seatId}</Button>;
  }

  return (
    <div>
      <h3>Pick a seat</h3>
      <small id="pickHelp" className="form-text text-muted ml-2"><Button color="secondary" /> – seat is already taken</small>
      <small id="pickHelpTwo" className="form-text text-muted ml-2 mb-4"><Button outline color="primary" /> – it's empty</small>
      <div className="seats">{[...Array(50)].map((x, i) => prepareSeat(i+1) )}</div>
      <p>Free seats: {50 - occupiedSeats}/50</p>
      { (requests['LOAD_SEATS'] && requests['LOAD_SEATS'].pending) && <Progress animated color="primary" value={50} /> }
      { (requests['LOAD_SEATS'] && requests['LOAD_SEATS'].error) && <Alert color="warning">Couldn't load seats</Alert> }
    </div>
  )
}

export default SeatChooser;