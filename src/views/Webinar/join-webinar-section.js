import "./styles-w.scss";

function JoinWebinarSection(props) {
  return (
    <section className="join-webinar-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="webinar-title-lg text-center">
              {props?.isFromLead
                ? "Thank You For Registration"
                : "Join Our Exciting Webinar!"}
            </div>
            <p className="text-center mb-5">
              Unlock the potential of your business by going online. Register
              now for invaluable insights!
            </p>
            <button
              className="register-webinar-btn"
              onClick={() =>
                props?.isFromLead
                  ? window.open(
                      props?.whatsAppUrl
                        ? props?.whatsAppUrl
                        : "https://chat.whatsapp.com/CSt5Uq9KBmj96FmaJYYYfk?mode=ems_copy_t",
                      "_blank"
                    )
                  : props.setOpenModal(true)
              }
            >
              {props?.isFromLead || props?.isFromLeadWithForm
                ? "JOIN WEBINAR WHATSAPP GROUP"
                : "Register for webinar"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JoinWebinarSection;
