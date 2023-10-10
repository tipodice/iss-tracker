/* eslint-disable react/prop-types */
function Menu({ menuData }) {

    const style = {
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
        position: 'absolute',
        borderRadius: '1rem',
        border: '1px solid rgba(189, 189, 189, 0.5)',
        right: 0,
        top: 0,
        margin: '1rem',
        padding: '1rem',
        color: 'rgba(189, 189, 189)',
        display: 'block'

    }

    const { name, coordinates, velocity } = menuData && menuData.length > 0 ? menuData[0] : '';

    return (
        <div id="menu-container" style={style}>
            <p>Name: {name}</p>
            <p>Latitude: {coordinates?.[1].toFixed(8)}</p>
            <p>Longitude: {coordinates?.[0].toFixed(8)}</p>
            <p>Altitude: {parseInt(coordinates?.[2] / 10000)} km</p>
            <p>Velocity: {velocity} km/h</p>


            <hr className="border border-secondary border-2 opacity-50" />
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                <label className="form-check-label">
                    Center ISS
                </label>
            </div>

        </div>
    )
}

export default Menu;