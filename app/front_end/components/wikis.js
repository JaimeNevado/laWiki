import React from "react";
import LinkButton from '../components/buttons/button_with_link';
const WikiList = ({ wikis }) => {
  return (
    <div className="row">
      {wikis.map((wiki) => (
        <div key={wiki._id} className="col-md-4">
          <div className="card mb-3">
            <img
              src={wiki.bg_image || "/placeholder.jpg"}
              className="card-img-top"
              alt={wiki.name || "Wiki Image"}
            />
            <div className="card-body text-center">
              <h5 className="card-title">{wiki.name}</h5>
              <LinkButton
                btn_type={"btn-primary"}
                button_text="View Wiki"
                state="enabled"
                link={`/wiki/${wiki._id}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WikiList;