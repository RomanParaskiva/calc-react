import React, { useCallback, useEffect, useState } from "react";
import useStore from "../store/store";

const ProgramList = ({ programs }) => {
  const { activeGuest, activeRoom, updateGuest, rooms } = useStore();
  const [selectedProgram, setSelectedProgram] = useState({ program: null, program_type: null, program_length: null });

  const { program_length, program, program_type } = rooms[activeRoom].people[activeGuest];

  const toggleProgram = useCallback((programId) => {
    const curProg = programs.find(prog => prog.id === programId)
    setSelectedProgram((prevState) => ({
      ...prevState,
      program: {
        id: prevState?.program?.id === programId ? null : programId,
        name: curProg.name
      },
      program_length: curProg?.types[0]?.lengths[0],
      program_type:  { ...curProg?.types[0] }
    }));
    updateGuest(activeRoom, activeGuest, {
      program: {
        id: programId,
        name: curProg.name
      },
      program_length: curProg?.types[0]?.lengths[0],
      program_type:  { ...curProg?.types[0] }
    })
  }, [activeGuest, activeRoom, programs, updateGuest]);

  const toggleType = (typeId, program_type_name) => {
    setSelectedProgram((prevState) => ({
      ...prevState,
      program_type: {
        id: prevState?.program_type?.id === typeId ? null : typeId,
        name: program_type_name
      }
    }));
    updateGuest(activeRoom, activeGuest, {
      program_type: {
        id: typeId,
        name: program_type_name
      }
    })
  };

  const toggleLength = (len) => {
    setSelectedProgram((prevState) => ({
      ...prevState,
      program_length: prevState?.program_length === len ? null : len
    }));

    updateGuest(activeRoom, activeGuest, { program_length: len })
  };

  useEffect(() => {
    if (program_length !== null && program !== null) {
      setSelectedProgram({
        program,
        program_type,
        program_length
      });
    } else {
      if (programs.length > 0) {
        setSelectedProgram({
          program: { id: programs[0]?.id, name: programs[0]?.name },
          program_type: { id: programs[0].types[0]?.id, name: programs[0]?.types[0]?.name },
          program_length: programs[0]?.types[0]?.lengths[0]
        });
        updateGuest(activeRoom, activeGuest, {
          program: { id: programs[0]?.id, name: programs[0]?.name },
          program_length: programs[0]?.types[0]?.lengths[0],
          program_type: { id: programs[0].types[0]?.id, name: programs[0]?.types[0]?.name }
        })
      }
    }
  }, [programs])

  return (
    <ul className="program_list">
      {programs?.length > 0 &&
        programs.map((program) => (
          <React.Fragment key={program.id}>
            <li>
              <label>
                <input
                  type="checkbox"
                  onChange={() => toggleProgram(program.id)}
                  checked={selectedProgram?.program?.id === program.id}
                />

                {program.name}
              </label>
            </li>
            {selectedProgram?.program?.id === program.id &&
              (program?.types?.length > 1 ? (
                <ul>
                  {program.types.map((type) => (
                    <React.Fragment key={type.id}>
                      <li key={type.id}>
                        <label>
                          <input
                            type="checkbox"
                            onChange={() => toggleType(type.id, type.name)}
                            checked={selectedProgram?.program_type?.id === type.id}
                          />
                          {type.name}
                        </label>
                      </li>
                      {selectedProgram?.program_type?.id === type.id && type?.lengths.length > 0 && (
                        <ul>
                          {type.lengths.map((len) => (
                            <li key={len}>
                              <label>
                                <input
                                  type="checkbox"
                                  onChange={() => toggleLength(len)}
                                  checked={selectedProgram?.program_length === len}
                                />
                                {len}
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              ) : (
                program?.types[0]?.lengths.length > 0 && (
                  <ul>
                    {program?.types[0].lengths.map((len) => (
                      <li key={len}>
                        <label>
                          <input
                            type="checkbox"
                            onChange={() => toggleLength(len)}
                            checked={selectedProgram?.program_length === len}
                          />
                          {len}
                        </label>
                      </li>
                    ))}
                  </ul>
                )
              ))}
          </React.Fragment>
        ))}
    </ul>
  );
};

export default ProgramList;
