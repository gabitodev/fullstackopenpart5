import PropTypes from 'prop-types';

const Notification = ({ notification }) => {
  if (!notification) return null;

  const createStyle = (color) => {
    return {
      color: `${color}`,
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    };
  };

  return (
    <div>
      {notification.isError
        ? <p className='error' style={createStyle('red')}>{notification.message}</p>
        : <p className='success' style={createStyle('green')}>{notification.message}</p>
      }
    </div>
  );
};

Notification.displayName = 'Notification';

Notification.propTypes = {
  notification: PropTypes.object,
};

export default Notification;